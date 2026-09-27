import Hero, { About, VisiMisi } from "@/components/site/HeroAbout";
import Layanan from "@/components/site/Layanan";
import GalleryGrid from "@/components/site/GalleryGrid";
import { Lokasi } from "@/components/site/Lokasi";
import Testimoni from "@/components/site/Testimoni";
import Kontak from "@/components/site/Kontak";
import Reveal from "@/components/site/Reveal";
import JadwalTerdekat from "@/components/site/JadwalTerdekat";
import {
  getGallery,
  getPrograms,
  getTestimonials,
  getActiveCategories,
  getUpcomingJadwal,
} from "@/lib/data";

// Selalu render dari DB terbaru supaya hasil edit dashboard langsung terlihat.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [programs, testimonials, gallery, categories, upcomingJadwal] =
    await Promise.all([
      getPrograms(),
      getTestimonials(),
      getGallery(),
      getActiveCategories(),
      getUpcomingJadwal(8),
    ]);

  return (
    <>
      <Hero />
      <About />
      <VisiMisi />
      <Layanan programs={programs} categories={categories} />

      {/* Jadwal Kelas Terdekat — jadwal aktif terdekat, diurutkan per occurrence WIB */}
      <JadwalTerdekat items={upcomingJadwal} />

      {/* Anchor #galeri — target nav "Galeri" di Header/Footer.
          Satu section galeri publik dengan struktur PROGRAM → TAHUN → FOTO
          (pengelompokan dilakukan di GalleryGrid dari data yang sudah
          di-include — termasuk foto tanpa kategori/program). */}
      <div id="galeri">
        {gallery.length > 0 && (
          <section className="section gallery-section" id="galeri-utama">
            <div className="wrap wrap-gallery">
              <Reveal className="section-head">
                <span className="kicker">Galeri</span>
                <h2>Dokumentasi kegiatan Talenta Cipta Karya</h2>
              </Reveal>
              <GalleryGrid items={gallery} />
            </div>
          </section>
        )}
      </div>

      <Lokasi />
      <Testimoni items={testimonials} />
      <Kontak />
    </>
  );
}
