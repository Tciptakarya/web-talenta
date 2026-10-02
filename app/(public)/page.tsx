import Hero, { About, VisiMisi } from "@/components/site/HeroAbout";
import Layanan from "@/components/site/Layanan";
import GalleryGrid from "@/components/site/GalleryGrid";
import { Lokasi } from "@/components/site/Lokasi";
import Testimoni from "@/components/site/Testimoni";
import Berita from "@/components/site/Berita";
import Kontak from "@/components/site/Kontak";
import Reveal from "@/components/site/Reveal";
import Rich from "@/components/site/Rich";
import { getContentMap, textOf } from "@/lib/siteContent";
import JadwalTerdekat from "@/components/site/JadwalTerdekat";
import {
  getGallery,
  getPrograms,
  getTestimonials,
  getActiveCategories,
  getUpcomingJadwal,
  getBerita,
} from "@/lib/data";

// Selalu render dari DB terbaru supaya hasil edit dashboard langsung terlihat.
/**
 * Halaman publik di-cache 60 detik (keputusan eksplisit user 2026-09-28).
 *
 * Sebelumnya `force-dynamic` → tiap pengunjung memicu render + query DB,
 * dan karena fungsi Vercel berjalan di US East sementara DB Neon di Singapura,
 * tiap render itu mahal (TTFB 1,3–2 detik).
 *
 * 60 detik chosen karena data publik berubah hanya lewat Admin, dan
 * `app/admin/actions.ts` sudah memanggil `revalidatePath("/", "layout")` pada
 * SETIAP perubahan admin — jadi begitu Anda menyimpan perubahan, cache
 * langsung dibuang dan pengunjung berikutnya dapat data terbaru. Jendela
 * basi hanya berlaku bila tidak ada perubahan admin sama sekali.
 *
 * Halaman `/admin/*` tetap `force-dynamic` (butuh real-time).
 */
export const revalidate = 60;

export default async function HomePage() {
  const [programs, testimonials, gallery, categories, upcomingJadwal, berita, c] =
    await Promise.all([
      getPrograms(),
      getTestimonials(),
      getGallery(),
      getActiveCategories(),
      getUpcomingJadwal(8),
      // Kabar terbaru - 3 berita aktif terakhir. Section disembunyikan
      // otomatis kalau belum ada berita (lihat components/site/Berita.tsx).
      getBerita(3),
      // Teks statis yang bisa diedit dari Admin > Tampilan Website.
      getContentMap(),
    ]);

  return (
    <>
      <Hero c={c} />
      <About c={c} />
      <VisiMisi c={c} />
      <Layanan programs={programs} categories={categories} c={c} />

      {/* Jadwal Kelas Terdekat — jadwal aktif terdekat, diurutkan per occurrence WIB */}
      <JadwalTerdekat items={upcomingJadwal} c={c} />

      {/* Anchor #galeri — target nav "Galeri" di Header/Footer.
          Satu section galeri publik dengan struktur PROGRAM → TAHUN → FOTO
          (pengelompokan dilakukan di GalleryGrid dari data yang sudah
          di-include — termasuk foto tanpa kategori/program). */}
      <div id="galeri">
        {gallery.length > 0 && (
          <section className="section gallery-section" id="galeri-utama">
            <div className="wrap wrap-gallery">
              <Reveal className="section-head">
                <span className="kicker">
                  <Rich text={textOf(c, "galeri.kicker")} />
                </span>
                <h2>
                  <Rich text={textOf(c, "galeri.title")} />
                </h2>
              </Reveal>
              <GalleryGrid items={gallery} />
            </div>
          </section>
        )}
      </div>

      {/* Kabar Terbaru - anchor #berita untuk menu "Berita" di Header/Footer.
          Ditaruh setelah Galeri, sebelum Lokasi. */}
      <Berita items={berita} c={c} />

      <Lokasi c={c} />
      <Testimoni items={testimonials} c={c} />
      <Kontak c={c} />
    </>
  );
}
