import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ToTop from "@/components/site/ToTop";

/**
 * Layout bersama untuk semua rute di group (public): beranda, /kelas,
 * dan /kelas/[slug]. Memastikan navbar + footer + tombol kembali ke atas
 * tampil konsisten di setiap halaman publik.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div id="top" />
      {children}
      <Footer />
      <ToTop />
    </>
  );
}