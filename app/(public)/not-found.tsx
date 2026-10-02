import type { Metadata } from "next";
import NotFoundContent from "@/components/site/NotFoundContent";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan | Talenta Cipta Karya",
  description:
    "Halaman yang Anda cari tidak ada. Kembali ke beranda atau lihat program pelatihan Talenta Cipta Karya.",
  robots: { index: false, follow: true },
};

/**
 * 404 untuk route di group `(public)` — beranda, `/kelas`, `/kelas/[slug]`,
 * `/program/[slug]`, `/berita`, `/berita/[slug]`.
 *
 * Dipakai saat `notFound()` dipanggil, mis. slug berita yang tidak ada atau
 * berita yang masih draft (`isActive=false` → 404, lihat `lib/data.ts`).
 *
 * File ini otomatis membungkus dirinya dengan `(public)/layout.tsx`, jadi
 * navbar + footer ikut tampil. `notFound()` **tidak** bisa dipanggil dari
 * layout, hanya dari page/route handler.
 */
export default function PublicNotFound() {
  return (
    <div className="section section-alt section-page">
      <div className="wrap">
        <NotFoundContent />
      </div>
    </div>
  );
}
