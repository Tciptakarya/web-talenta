import { getActiveCategories } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Program Kelas | Talenta Cipta Karya",
  description: "Daftar semua kategori program pelatihan di Talenta Cipta Karya.",
};

function CategoryChips({ categories, currentSlug }: { categories: { slug: string; name: string }[]; currentSlug?: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Filter kategori">
      <Link
        href="/kelas"
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
          !currentSlug
            ? "bg-navy text-white"
            : "bg-white text-navy border border-line hover:bg-paper"
        }`}
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

export default async function KelasIndexPage() {
  const categories = await getActiveCategories();

  return (
    <div className="section section-alt section-page" id="kelas-index">
      <div className="wrap">
        {/* Tombol kembali ke beranda — pojok kiri atas */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-navy hover:text-gold mb-6"
        >
          ← Kembali ke beranda
        </Link>

        <div className="section-head text-center mb-12 mx-auto">
          <span className="kicker">Program Kelas</span>
          <h2>Pilih kategori untuk melihat program pelatihan</h2>
        </div>

        <CategoryChips categories={categories} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kelas/${cat.slug}`}
              className="rounded-2xl bg-white border border-line overflow-hidden hover:border-gold hover:shadow-lg transition flex flex-col"
            >
              {cat.image && (
                <div className="relative aspect-[16/9] bg-line">
                  <img
                    src={cat.image}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col gap-2">
                <h3 className="font-display text-xl font-semibold text-navy">
                  {cat.name}
                </h3>
                {/* Placeholder non-breaking space: menjaga tinggi kartu &
                    posisi CTA seragam walau deskripsi kosong */}
                <p className="text-sm text-mist line-clamp-2">
                  {cat.description ?? "\u00A0"}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-gold mt-auto pt-2">
                  Lihat program →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-mist py-12">
            Belum ada kategori aktif.
          </p>
        )}
      </div>
    </div>
  );
}