import { prisma } from "@/lib/prisma";
import MateriManager from "@/components/admin/MateriManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Materi Pelatihan — Admin" };

export default async function MateriPage() {
  const [materi, programs] = await Promise.all([
    prisma.materiPelatihan
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
          Kelola Materi Pelatihan
        </h1>
        <p className="text-sm text-mist mt-1">
          Atur modul, dokumen PDF, video, dan slide materi pelatihan untuk peserta.
          Materi hanya ditampilkan di dashboard admin — tidak tampil di halaman publik.
        </p>
      </div>
      <MateriManager materi={materi} programs={programs} />
    </div>
  );
}