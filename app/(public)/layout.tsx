import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ToTop from "@/components/site/ToTop";
import AnchorHashCleaner from "@/components/site/AnchorHashCleaner";
import { getContentMap } from "@/lib/siteContent";

/**
 * Layout bersama untuk semua rute di group (public): beranda, /kelas,
 * dan /kelas/[slug]. Memastikan navbar + footer + tombol kembali ke atas
 * tampil konsisten di setiap halaman publik.
 *
 * Label menu navbar/footer ikut diambil dari Tampilan Website (satu query
 * tambahan; halaman publik sudah di-cache ISR 60 detik jadi tidak terasa).
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await getContentMap();

  return (
    <>
      <Header c={c} />
      <div id="top" />
      {children}
      <Footer c={c} />
      <ToTop />
      {/* Bersihkan #fragment dari address bar setelah anchor diklik
          (anchor tetap native — lihat komentar komponen). */}
      <AnchorHashCleaner />
    </>
  );
}