import { prisma } from "@/lib/prisma";
import ProgramManager from "@/components/admin/ProgramManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Program — Admin" };

export default async function ProgramPage() {
  const [programs, categories] = await Promise.all([
    prisma.program
      .findMany({ orderBy: { urutan: "asc" }, include: { category: true } })
      .catch(() => []),
    prisma.category
      .findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
      .catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kelola Program
        </h1>
        <p className="text-sm text-mist mt-1">
          Kelola program/kelas: nama, deskripsi, kategori, status aktif, dan urutan.
          Perubahan langsung tampil di section Layanan dan halaman /kelas.
        </p>
      </div>
      <ProgramManager programs={programs} categories={categories} />
    </div>
  );
}
