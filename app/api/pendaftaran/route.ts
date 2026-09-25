import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pendaftaranSchema } from "@/lib/schemas";
import { sendPendaftaranNotification } from "@/lib/resend";
import { isRateLimited } from "@/lib/rateLimit";
import { formatTanggalYmd, ymdWib } from "@/lib/data";

/**
 * POST /api/pendaftaran — form pendaftaran pelatihan publik:
 * validasi Zod → cek kuota jadwal → simpan Pendaftaran → notifikasi email (Resend).
 * Reliabilitas §8: notifikasi email gagal TIDAK membatalkan pendaftaran — baris tetap
 * tersimpan dan tampil di /admin/pendaftaran (pola ContactMessage).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payload tidak valid." },
      { status: 400 }
    );
  }

  const parsed = pendaftaranSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot terisi → hampir pasti bot. Balas seolah sukses agar tidak mengulang.
    const honeypotFilled = parsed.error.issues.some(
      (issue) => issue.path[0] === "website"
    );
    if (honeypotFilled) return NextResponse.json({ ok: true });

    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." },
      { status: 400 }
    );
  }

  // Jaring pengaman spam: maksimal 10 pendaftaran / 10 menit / IP
  // (dilonggarkan agar jaringan bersama — kantor/sekolah — tidak terblokir).
  const ip =
    (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() ||
    "unknown";
  if (isRateLimited(`pendaftaran:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti atau hubungi kami via WhatsApp.",
      },
      { status: 429 }
    );
  }

  const { jadwalId, nama, wa, email, catatan } = parsed.data;

  // Jadwal & program harus ada dan masih aktif.
  const jadwal = await prisma.jadwalPelatihan
    .findUnique({
      where: { id: jadwalId },
      include: {
        program: { select: { judul: true, isActive: true } },
        // Kursi terpakai = pendaftar yang belum ditolak.
        pendaftaran: {
          where: { status: { not: "ditolak" } },
          select: { id: true },
        },
      },
    })
    .catch(() => null);

  if (!jadwal || !jadwal.isActive || !jadwal.program.isActive) {
    return NextResponse.json(
      { ok: false, error: "Jadwal ini sudah tidak tersedia. Silakan pilih jadwal lain." },
      { status: 404 }
    );
  }

  if (jadwal.kuota !== null && jadwal.pendaftaran.length >= jadwal.kuota) {
    return NextResponse.json(
      { ok: false, error: "Kuota batch ini sudah penuh. Silakan pilih jadwal lain." },
      { status: 409 }
    );
  }

  // 1. Simpan dulu — lead tidak boleh hilang meski email gagal (§8)
  let savedId: number | null = null;
  try {
    const saved = await prisma.pendaftaran.create({
      data: {
        jadwalId,
        nama,
        wa,
        email: email || null,
        catatan: catatan || null,
        statusEmail: "pending",
      },
    });
    savedId = saved.id;
  } catch (err) {
    console.error("[pendaftaran] gagal menyimpan pendaftaran:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server sedang bermasalah. Silakan hubungi kami via WhatsApp 0811-9700-322.",
      },
      { status: 500 }
    );
  }

  // 2. Notifikasi email ke admin (boleh gagal — status dicatat di DB)
  const jadwalLabel = jadwal.tanggal
    ? `${jadwal.hari}, ${formatTanggalYmd(ymdWib(jadwal.tanggal))}`
    : `Setiap ${jadwal.hari}`;

  const status = await sendPendaftaranNotification({
    nama,
    wa,
    email: email || null,
    catatan: catatan || null,
    programJudul: jadwal.program.judul,
    jadwalLabel,
    jamLabel: `${jadwal.jamMulai} - ${jadwal.jamAkhir} WIB`,
    ruangan: jadwal.ruangan,
  });

  await prisma.pendaftaran
    .update({ where: { id: savedId }, data: { statusEmail: status } })
    .catch((err) =>
      console.error("[pendaftaran] gagal memperbarui statusEmail:", err)
    );

  if (status === "failed") {
    console.warn(
      `[pendaftaran] email notifikasi gagal — pendaftaran #${savedId} tetap tersimpan di /admin/pendaftaran.`
    );
  }

  return NextResponse.json({ ok: true, id: savedId });
}
