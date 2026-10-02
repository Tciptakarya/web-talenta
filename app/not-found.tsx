import type { Metadata } from "next";
import NotFoundContent from "@/components/site/NotFoundContent";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan | Talenta Cipta Karya",
  description:
    "Halaman yang Anda cari tidak ada. Kembali ke beranda atau lihat program pelatihan Talenta Cipta Karya.",
  robots: { index: false, follow: true },
};

/**
 * 404 global — untuk URL yang **tidak cocok route sama sekali** (mis.
 * `/foo/bar`). File ini hanya dibungkus `app/layout.tsx` (root layout), jadi
 * navbar/footer `(public)/layout.tsx` tidak ikut tampil; makanya
 * `standalone` = true dan komponennya menyediakan latarnya sendiri.
 *
 * Tanpa file ini, Next memakai 404 bawaannya yang menyuntik
 * `body{background:#000}` saat OS dalam mode gelap dan sama sekali
 * mengabaikan design system situs. Lihat catatan panjang di
 * `components/site/NotFoundContent.tsx`.
 */
export default function NotFound() {
  return <NotFoundContent standalone />;
}
