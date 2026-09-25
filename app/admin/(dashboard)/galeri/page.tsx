import { prisma } from "@/lib/prisma";
import UploadForm from "@/components/admin/UploadForm";
import GaleriList, {
  type AdminGalleryItem,
} from "@/components/admin/GaleriList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Galeri — Admin" };

export default async function GaleriPage() {
  const [items, categories, programs] = await Promise.all([
    prisma.galleryImage
      .findMany({
        orderBy: [{ urutan: "asc" }, { uploadedAt: "desc" }],
        include: {
          category: { select: { id: true, name: true } },
          program: { select: { id: true, judul: true } },
        },
      })
      .catch(() => []),
    prisma.category
      .findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      })
      .catch(() => []),
    prisma.program
      .findMany({
        orderBy: { judul: "asc" },
        select: { id: true, judul: true, categoryId: true },
      })
      .catch(() => []),
  ]);

  const daftar: AdminGalleryItem[] = items.map((i) => ({
    id: i.id,
    url: i.url,
    caption: i.caption,
    alt: i.alt,
    urutan: i.urutan,
    category: i.category,
    program: i.program,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Kelola Galeri
        </h1>
        <p className="text-sm text-mist mt-1">
          Upload banyak foto sekaligus, atur urutan tampil (↑/↓), dan koreksi
          caption/kategori/program lewat tombol Edit — semuanya langsung tampil
          di halaman publik tanpa deploy.
        </p>
      </div>

      <UploadForm categories={categories} programs={programs} />

      <div>
        <h2 className="font-display text-xl font-semibold text-navy mb-4">
          Foto ({daftar.length})
        </h2>
        <GaleriList
          items={daftar}
          categories={categories}
          programs={programs}
        />
      </div>
    </div>
  );
}

