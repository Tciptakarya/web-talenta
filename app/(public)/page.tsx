import Hero, { About, VisiMisi } from "@/components/site/HeroAbout";
import Layanan from "@/components/site/Layanan";
import GalleryGrid from "@/components/site/GalleryGrid";
import { Lokasi } from "@/components/site/Lokasi";
import Testimoni from "@/components/site/Testimoni";
import Kontak from "@/components/site/Kontak";
import Reveal from "@/components/site/Reveal";
import JadwalTerdekat from "@/components/site/JadwalTerdekat";
import {
  getGalleryGroups,
  getPrograms,
  getTestimonials,
  getActiveCategories,
  getUpcomingJadwal,
} from "@/lib/data";

// Selalu render dari DB terbaru supaya hasil edit dashboard langsung terlihat.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [programs, testimonials, galleryGroups, categories, upcomingJadwal] =
    await Promise.all([
      getPrograms(),
      getTestimonials(),
      getGalleryGroups(),
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

      {/* Anchor #galeri — target nav "Galeri" di Header/Footer */}
      <div id="galeri">
        {galleryGroups.groups.map((group) => (
          <section key={group.category.id} className="section" id={`galeri-${group.category.slug}`}>
            <div className="wrap">
              <Reveal className="section-head">
                <span className="kicker">{group.category.name}</span>
                <h2>{group.category.description ?? `Dokumentasi kegiatan ${group.category.name}`}</h2>
              </Reveal>
              <GalleryGrid items={group.items} />
            </div>
          </section>
        ))}

        {galleryGroups.lainnya.length > 0 && (
          <section className="section" id="galeri-lainnya">
            <div className="wrap">
              <Reveal className="section-head">
                <span className="kicker">Galeri Lainnya</span>
                <h2>Dokumentasi kegiatan pelatihan kami</h2>
              </Reveal>
              <GalleryGrid items={galleryGroups.lainnya} />
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
