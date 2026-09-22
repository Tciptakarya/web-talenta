import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas";
import { sendContactNotification } from "@/lib/resend";

/**
 * POST /api/contact — form kontak publik (PRD §6):
 * validasi Zod → simpan ke ContactMessage → kirim notifikasi email via Resend
 * ke info@talentaciptakarya.com. Pesan tetap tersimpan bila email gagal (§8).
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Data tidak valid." },
      { status: 400 }
    );
  }

  const { nama, email, pesan } = parsed.data;

  // 1. Simpan dulu — lead tidak boleh hilang meski email gagal (§8)
  let savedId: number | null = null;
  try {
    const saved = await prisma.contactMessage.create({
      data: { nama, email, pesan, statusEmail: "pending" },
    });
    savedId = saved.id;
  } catch (err) {
    console.error("[contact] gagal menyimpan pesan:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server sedang bermasalah. Silakan hubungi kami via WhatsApp 0811-9700-322.",
      },
      { status: 500 }
    );
  }

  // 2. Kirim notifikasi email (boleh gagal — status dicatat di DB)
  const status = await sendContactNotification({ nama, email, pesan });

  try {
    await prisma.contactMessage.update({
      where: { id: savedId! },
      data: { statusEmail: status },
    });
  } catch (err) {
    console.error("[contact] gagal memperbarui statusEmail:", err);
  }

  if (status === "failed") {
    console.warn(
      `[contact] email notifikasi gagal terkirim — pesan #${savedId} tetap tersimpan di dashboard /admin/pesan.`
    );
  }

  return NextResponse.json({ ok: true });
}
