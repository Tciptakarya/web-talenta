import { prisma } from "@/lib/prisma";
import { formatTanggalYmd, ymdWib } from "@/lib/data";
import PendaftaranList, {
  type AdminPendaftaran,
} from "@/components/admin/PendaftaranList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pendaftaran — Admin" };

/**
 * Inbox pendaftaran pelatihan dari tabel jadwal publik.
 * Data tetap tampil walau notifikasi email gagal (statusEmail dicatat per baris).
 */
export default async function PendaftaranPage() {
  const rows = await prisma.pendaftaran
    .findMany({
      include: {
        jadwal: {
          select: {
            hari: true,
            tanggal: true,
            jamMulai: true,
            jamAkhir: true,
            program: { select: { judul: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const items: AdminPendaftaran[] = rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    wa: r.wa,
    email: r.email,
    catatan: r.catatan,
    status: r.status,
    statusEmail: r.statusEmail,
    createdAt: r.createdAt.toISOString(),
    programJudul: r.jadwal.program.judul,
    jadwalLabel: r.jadwal.tanggal
      ? `${r.jadwal.hari}, ${formatTanggalYmd(ymdWib(r.jadwal.tanggal))}`
      : `Setiap ${r.jadwal.hari}`,
    jamLabel: `${r.jadwal.jamMulai} - ${r.jadwal.jamAkhir} WIB`,
  }));

  const now = new Date();
  const stats = [
    { label: "Baru", value: items.filter((i) => i.status === "baru").length },
    {
      label: "Dikonfirmasi",
      value: items.filter((i) => i.status === "dikonfirmasi").length,
    },
    {
      label: "Bulan ini",
      value: items.filter((i) => {
        const d = new Date(i.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Pendaftaran
        </h1>
        <p className="text-sm text-mist mt-1">
          Semua pendaftar dari tombol &quot;Daftar&quot; di tabel jadwal publik —
          konfirmasi lewat WhatsApp, lalu ubah statusnya di sini.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-line p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-mist">
              {s.label}
            </p>
            <p className="font-display text-3xl font-semibold text-navy mt-2">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <PendaftaranList items={items} />
    </div>
  );
}
