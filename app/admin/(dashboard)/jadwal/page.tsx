import { prisma } from "@/lib/prisma";
import JadwalManager from "@/components/admin/JadwalManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jadwal Pelatihan — Admin" };

export default async function JadwalPage() {
  const [jadwal, programs] = await Promise.all([
    prisma.jadwalPelatihan
      .findMany({
        include: { program: { select: { id: true, judul: true } } },
        orderBy: [{ urutan: "asc" }, { id: "asc" }],
      })
      .catch(() => []),
    prisma.program
      .findMany({
        select: { id: true, judul: true },
        orderBy: { judul: "asc" },
      })
      .catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kelola Jadwal Pelatihan
        </h1>
        <p className="text-sm text-mist mt-1">
          Atur jadwal kursus, penugasan instruktur, serta penggunaan ruang kelas.
          Jadwal yang aktif tampil di halaman publik /kelas.
        </p>
      </div>
      <JadwalManager jadwal={jadwal} programs={programs} />
    </div>
  );
}