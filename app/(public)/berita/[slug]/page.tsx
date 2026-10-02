import { notFound } from "next/navigation";
import Link from "next/link";
import { getBeritaBySlug, getBerita, formatTanggalIndo } from "@/lib/data";
import { BeritaMedia } from "@/components/site/BeritaMedia";
import BeritaBody from "@/components/site/BeritaBody";

/**
 * Cache 60 detik — sama seperti halaman publik lain. `force-static` WAJIB
 * menyertai `revalidate` (lihat DECISIONS.md); tanpa itu Next 15 merender
 * rute `[slug]` on-demand dan mengirim `no-store`.
 */
export const dynamic = "force-static";
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Judul & deskripsi diambil dari data berita (bukan `generateMetadata` async
 * terpisah) — satu query dipakai untuk metadata sekaligus halaman, jadi
 * tidak ada query ganda. `getBeritaBySlug` sudah di-cache dalam render ini.
 */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);
  if (!item) return { title: "Berita tidak ditemukan | Talenta Cipta Karya" };
  return {
    title: `${item.judul} | Talenta Cipta Karya`,
    description: item.ringkasan.slice(0, 160),
    openGraph: {
      title: item.judul,
      description: item.ringkasan.slice(0, 160),
      ...(item.imageUrl ? { images: [{ url: item.imageUrl }] } : {}),
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getBeritaBySlug(slug);

  // Draft (isActive=false) juga menghasilkan 404 di sini — berita yang
  // belum tayang tidak boleh bisa dibuka lewat URL-nya.
  if (!item) notFound();

  // Berita lain (maksimal 3) supaya pembaca bisa lanjut membaca.
  const terkait = (await getBerita(4))
    .filter((b) => b.id !== item.id)
    .slice(0, 3);

  const tanggal = formatTanggalIndo(item.tanggal);

  return (
    <article className="section section-alt section-page" id="berita-detail">
      <div className="wrap wrap-artikel">
        <Link href="/berita" className="berita-kembali">
          ← Kembali ke semua berita
        </Link>

        {/* WAJIB <div>, bukan <header>.
            app/globals.css:131 punya rule global `header{position:fixed;
            top:0; z-index:100}` — elemen <header> di dalam konten akan
            menjadi fixed dan menumpuk di tepi atas layar, menutupi judul.
            (Jebakan yang sama pernah menimpa kop program galeri; lihat
            AGENTS.md & CHANGELOG 2026-09-28.) */}
        <div className="berita-detail-head">
          <div className="berita-meta berita-meta--center">
            {item.kategori && <span className="berita-kategori">{item.kategori}</span>}
            <time dateTime={item.tanggal.toISOString().slice(0, 10)}>{tanggal}</time>
          </div>
          <h1 className="berita-detail-title">{item.judul}</h1>
          <p className="berita-detail-ringkas">{item.ringkasan}</p>
        </div>

        <div className="berita-detail-media">
          <BeritaMedia item={item} priority />
        </div>

        <BeritaBody isi={item.isi} />

        {terkait.length > 0 && (
          <aside className="berita-terkait" aria-label="Berita lainnya">
            <h2 className="berita-terkait-title">Berita lainnya</h2>
            <ul className="berita-terkait-list">
              {terkait.map((b) => (
                <li key={b.id}>
                  <Link href={`/berita/${b.slug}`} className="berita-terkait-item">
                    {b.kategori && <span className="berita-kategori">{b.kategori}</span>}
                    <span className="berita-terkait-judul">{b.judul}</span>
                    <time
                      className="berita-terkait-tanggal"
                      dateTime={b.tanggal.toISOString().slice(0, 10)}
                    >
                      {formatTanggalIndo(b.tanggal)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </article>
  );
}
