import { prisma } from "@/lib/prisma";
import KategoriManager from "@/components/admin/KategoriManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kategori Kelas — Admin" };

export default async function KategoriPage() {
  const categories = await prisma.category
    .findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kategori Kelas
        </h1>
        <p className="text-sm text-mist mt-1">
          Kelola kategori kelas. Nama &amp; slug unik; slug dibuat otomatis dari
          nama. Kategori yang masih dipakai program/foto tidak bisa dihapus —
          nonaktifkan atau pindahkan data dulu.
        </p>
      </div>
      <KategoriManager categories={categories} />
    </div>
  );
}