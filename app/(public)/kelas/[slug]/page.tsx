import { notFound } from "next/navigation";
import { getCategoryBySlug, getProgramsByCategory, getGalleryByCategory, getActiveCategories } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import GalleryGrid from "@/components/site/GalleryGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Kategori tidak ditemukan | Talenta Cipta Karya" };
  }
  return {
    title: `${category.name} | Talenta Cipta Karya`,
    description: category.description ?? `Program pelatihan ${category.name} di Talenta Cipta Karya.`,
    openGraph: {
      title: `${category.name} | Talenta Cipta Karya`,
      description: category.description ?? `Program pelatihan ${category.name}`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

function CategoryChips({ categories, currentSlug }: { categories: { slug: string; name: string }[]; currentSlug: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter kategori">
      <Link
        href="/kelas"
        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-navy border border-line hover:bg-paper transition"
      >
        Semua
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/kelas/${cat.slug}`}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
            currentSlug === cat.slug
              ? "bg-navy text-white"
              : "bg-white text-navy border border-line hover:bg-paper"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

export default async function KelasSlugPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) {
    notFound();
  }

  const [programs, gallery, allCategories] = await Promise.all([
    getProgramsByCategory(category.id),
    getGalleryByCategory(category.id),
    getActiveCategories(),
  ]);

  if (!category || !category.isActive) {
    notFound();
  }

  // Filter programs & gallery by category.id
  const categoryPrograms = programs.filter((p) => p.categoryId === category.id);
  const categoryGallery = gallery.filter((g) => g.categoryId === category.id);

  return (
    <div className="section section-alt" id="kelas-detail">
      <div className="wrap">
        {/* Back to index */}
        <Link
          href="/kelas"
          className="inline-flex items-center gap-1 text-sm text-navy hover:text-gold mb-6"
        >
          ← Kembali ke semua kategori
        </Link>

        {/* Hero */}
        {category.image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-line">
            <Image
              src={category.image}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="section-head mb-8">
          <span className="kicker">{category.name}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy">
            {category.name.toUpperCase()}
          </h1>
          {category.description && (
            <p className="mt-2 text-lg text-mist max-w-2xl">{category.description}</p>
          )}
        </div>

        {/* Category chips for navigation */}
        <CategoryChips categories={allCategories} currentSlug={slug} />

        {/* Programs */}
        <section aria-labelledby="programs-heading" className="mb-12">
          <h2 id="programs-heading" className="font-display text-2xl font-semibold text-navy mb-6">
            Program di kategori ini
          </h2>
          {categoryPrograms.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPrograms.map((p) => (
                <Link
                  key={p.id}
                  href={`/program/${p.slug}`}
                  className="rounded-2xl bg-white border border-line p-6 space-y-3 hover:border-gold hover:shadow-lg transition"
                >
                  <h3 className="font-display text-lg font-semibold text-navy">{p.judul}</h3>
                  <p className="text-sm text-mist line-clamp-3">{p.deskripsi}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-gold">
                    Selengkapnya →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-mist">Belum ada program untuk kategori ini.</p>
          )}
        </section>

        {/* Gallery */}
        {categoryGallery.length > 0 && (
          <section aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="font-display text-2xl font-semibold text-navy mb-6">
              Galeri {category.name}
            </h2>
            <GalleryGrid items={categoryGallery} />
          </section>
        )}
      </div>
    </div>
  );
}