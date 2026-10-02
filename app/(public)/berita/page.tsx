import Link from "next/link";
import { getBerita, getBeritaCategories } from "@/lib/data";
import BeritaList from "@/components/site/BeritaList";

/**
 * Cache 60 detik — angka & alasan yang sama dengan halaman publik lain
 * (lihat DECISIONS.md → *Halaman publik di-cache 60 detik*).
 * Jangan diubah tanpa keputusan eksplisit: `refresh()` di
 * `app/admin/actions.ts` sudah membuang cache setiap ada perubahan admin,
 * jadi berita yang baru di-tublish tetap langsung terlihat.
 */
export const revalidate = 60;

export const metadata = {
  title: "Berita & Kabar Talenta | Talenta Cipta Karya",
  description:
    "Kabar terbaru dan liputan kegiatan Talenta Cipta Karya: pelatihan, kemitraan, dan presta.",
};

/**
 * Halaman ini tidak membaca `cookies()`, `headers()`, atau `searchParams()`
 * (filter kategori sengaja dikerjakan di browser — lihat `BeritaList.tsx`),
 * jadi aman dikunci sebagai static. `force-static` WAJIB menyertai
 * `revalidate`, tanpa itu Next 15 tetap mengirim `no-store`.
 */
export const dynamic = "force-static";

export default async function BeritaIndexPage() {
  const [items, kategori] = await Promise.all([getBerita(), getBeritaCategories()]);

  // Hanya kategori yang benar-benar dipakai berita aktif yang jadi chip,
  // supaya tidak ada filter yang tak pernah menghasilkan apa pun.
  const kategoriDipakai = kategori.filter((k) => items.some((b) => b.kategori === k));

  return (
    <div className="section section-alt section-page" id="berita-index">
      <div className="wrap">
        <Link href="/" className="berita-kembali">
          ← Kembali ke beranda
        </Link>

        <div className="section-head text-center mb-10 mx-auto">
          <span className="kicker">Berita &amp; Kabar</span>
          <h2>Cerita kegiatan Talenta Cipta Karya</h2>
          <p className="berita-index-sub">
            Liputan pelatihan, kemitraan, dan prestasi yang kami jalankan bersama
            peserta dan mitra industri.
          </p>
        </div>

        {items.length === 0 ? (
          // Pesan yang sama persis dengan empty state di beranda, supaya
          // whoever yang datang lewat /berita atau lewat menu tidak melihat
          // dua kalimat berbeda untuk kondisi yang sama.
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
              Belum ada kabar kegiatan yang dipublikasikan. Halaman ini akan
              terisi begitu ada berita baru.
            </p>
            <Link href="/" className="btn btn-ghost berita-kosong-cta">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <BeritaList items={items} kategori={kategoriDipakai} />
        )}
      </div>
    </div>
  );
}
