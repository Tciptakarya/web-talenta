import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Rich from "@/components/site/Rich";
import BeritaCard from "@/components/site/BeritaCard";
import { textOf, type ContentMap } from "@/lib/siteContent";
import type { BeritaRow } from "@/lib/berita-types";

/**
 * Section "Kabar Terbaru" di beranda — 3 berita terbaru.
 *
 * ## Section ini TIDAK disembunyikan saat berita kosong
 *
 * Menu navbar/footer "Berita" memakai anchor `/#berita`. Kalau section-nya
 * `return null` saat belum ada berita (semula begitu), mengklik menu itu
 * **tidak terjadi apa-apa** — pengguna menekan tombol tapi tidak melihat
 * perubahan apa pun, dan tidak ada penjelasan kenapa. Jadi ketika kosong,
 * section tetap dirender dengan pesan yang jelas.
 *
 * (Section Galeri masih memakai pola lama `length > 0 &&` — tidak diubah
 * karena di luar scope task ini.)
 */
export default function Berita({
  items,
  c,
}: {
  items: BeritaRow[];
  c: ContentMap;
}) {
  const kosong = items.length === 0;

  return (
    // Class `section` (paper), BUKAN `section-alt` (putih): posisinya sekarang
    // tepat di bawah Hero dan di atas "Tentang Kami" yang juga putih —
    // memakai putih akan menyatu jadi blok 200px tanpa pembatas. Lihat
    // app/(public)/page.tsx.
    <section className="section" id="berita">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="kicker">
            <Rich text={textOf(c, "berita.kicker")} />
          </span>
          <h2>
            <Rich text={textOf(c, "berita.title")} />
          </h2>
        </Reveal>

        {kosong ? (
          <Reveal>
            <div className="berita-kosong-panel">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="berita-kosong-icon"
                aria-hidden="true"
              >
                <path d="M4 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
                <path d="m17 10 4-2v8l-4-2z" />
                <path d="M7 9h6M7 12h6M7 15h4" />
              </svg>
              <p className="berita-kosong-judul">
                Belum ada berita untuk saat ini
              </p>
              <p className="berita-kosong-ket">
                Kabar kegiatan terbaru akan muncul di sini. Sementara itu, Anda
                bisa melihat program pelatihan yang sedang dibuka.
              </p>
              <Link href="/kelas" className="btn btn-ghost berita-kosong-cta">
                Lihat Program Kelas
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal className="berita-grid">
              {items.map((item, i) => (
                <BeritaCard key={item.id} item={item} priority={i === 0} compact />
              ))}
            </Reveal>

            <Reveal>
              <p className="berita-lihat-semua">
                <Link href="/berita" className="btn btn-ghost">
                  <Rich text={textOf(c, "berita.lihatSemua")} />
                </Link>
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
