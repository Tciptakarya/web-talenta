import Link from "next/link";
import { formatTanggalIndo } from "@/lib/tanggal";
import type { BeritaRow } from "@/lib/berita-types";
import { BeritaMedia } from "@/components/site/BeritaMedia";

/**
 * Satu kartu berita untuk daftar (/berita) dan section beranda.
 *
 * Tanggal ditampilkan dalam bahasa Indonesia ("12 Oktober 2026") — bukan
 * `toLocaleDateString("id-ID")` supaya tidak bergeser zona waktu di server
 * Vercel (UTC). Lihat `formatTanggalIndo` di `lib/data.ts`.
 */
export default function BeritaCard({
  item,
  priority = false,
  compact = false,
}: {
  item: BeritaRow;
  priority?: boolean;
  compact?: boolean;
}) {
  const tanggal = formatTanggalIndo(item.tanggal);

  return (
    <article className="berita-card">
      <Link
        href={`/berita/${item.slug}`}
        className="berita-card-media block overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        <BeritaMedia item={item} priority={priority} compact={compact} />
      </Link>

      <div className="berita-card-body">
        <div className="berita-meta">
          {item.kategori && <span className="berita-kategori">{item.kategori}</span>}
          <time dateTime={item.tanggal.toISOString().slice(0, 10)}>{tanggal}</time>
        </div>

        <h3 className="berita-card-title">
          {/* Link judul = link utama. Link gambar di atas memakai tabIndex
              -1 supaya tidak jadi target keyboard kedua. */}
          <Link href={`/berita/${item.slug}`} className="hover:text-blue">
            {item.judul}
          </Link>
        </h3>

        <p className="berita-card-ringkas">{item.ringkasan}</p>

        <Link
          href={`/berita/${item.slug}`}
          className="berita-card-more"
          aria-label={`Baca berita: ${item.judul}`}
        >
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
}
