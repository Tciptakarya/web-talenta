import { prisma } from "@/lib/prisma";
import UploadForm from "@/components/admin/UploadForm";
import GaleriList from "@/components/admin/GaleriList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Galeri — Admin" };

export default async function GaleriPage() {
  const [items, categories] = await Promise.all([
    prisma.galleryImage
      .findMany({
        orderBy: [{ urutan: "asc" }, { uploadedAt: "desc" }],
        include: { category: true },
      })
      .catch(() => []),
    prisma.category
      .findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
      .catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kelola Galeri
        </h1>
        <p className="text-sm text-mist mt-1">
          Upload foto baru atau hapus foto lama — langsung tampil di halaman
          publik.
        </p>
      </div>

      <UploadForm categories={categories} />

      <div>
        <h2 className="font-display text-xl font-semibold text-navy mb-4">
          Foto ({items.length})
        </h2>
        <GaleriList items={items} />
      </div>
    </div>
  );
}
