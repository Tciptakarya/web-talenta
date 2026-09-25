import { prisma } from "@/lib/prisma";
import { ymdWib } from "@/lib/data";
import JadwalManager, { type AdminJadwal } from "@/components/admin/JadwalManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jadwal Pelatihan — Admin" };

export default async function JadwalPage() {
  const [jadwalRaw, programs, categories] = await Promise.all([
    prisma.jadwalPelatihan
      .findMany({
        include: { program: { select: { id: true, judul: true } } },
        orderBy: [{ urutan: "asc" }, { id: "asc" }],
      })
      .catch(() => []),
    prisma.program
      .findMany({
        select: { id: true, judul: true, categoryId: true },
        orderBy: { judul: "asc" },
      })
      .catch(() => []),
    // Semua kategori (tanpa filter aktif) — label grouping dropdown Program.
    prisma.category
      .findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
      .catch(() => []),
  ]);

  // Prisma mengembalikan tanggal sebagai Date — konversi ke "YYYY-MM-DD" (WIB)
  // agar cocok dengan tipa AdminJadwal & defaultValue input type="date".
  const jadwal: AdminJadwal[] = jadwalRaw.map((j) => ({
    id: j.id,
    programId: j.programId,
    instruktur: j.instruktur,
    ruangan: j.ruangan,
    kuota: j.kuota,
    hari: j.hari,
    tanggal: j.tanggal ? ymdWib(j.tanggal) : null,
    jamMulai: j.jamMulai,
    jamAkhir: j.jamAkhir,
    urutan: j.urutan,
    isActive: j.isActive,
    program: j.program,
  }));

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
      <JadwalManager jadwal={jadwal} programs={programs} categories={categories} />
    </div>
  );
}