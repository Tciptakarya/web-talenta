import Image from "next/image";
import Script from "next/script";
import type { BeritaRow } from "@/lib/berita-types";

/**
 * Media berita: foto utama, atau video (embed / file unggahan).
 *
 * ## Tiga sumber video
 * - `videoUrl`  → file yang diunggah ke Vercel Blob, diputar dengan `<video>`.
 * - `videoLink` → ID hasil `parseVideoLink()`:
 *   - YouTube   → `<iframe>` ke `youtube-nocookie.com`
 *   - Vimeo     → `<iframe>` ke `player.vimeo.com`
 *   - Instagram → `<blockquote class="instagram-media">` + `instagram.com/embed.js`
 *
 * **Alasan URL dibangun di sini, bukan dari input admin:** `videoLink` di
 * database hanya berisi ID (`yt:ID` / `vm:ID` / `ig:SHORTCODE`), sudah
 * dipisah jadi `videoLink` + `videoHost` di `lib/data.ts`. Tidak ada string
 * milik admin yang masuk ke `src`/`data-instgrm-permalink`, jadi admin tidak
 * bisa menyuntikkan domain atau atribut lain.
 *
 * ## Instagram: batasan yang perlu diketahui
 * Embed Instagram HANYA jalan kalau kontennya publik dan creator tidak
 * mematikan pengaturan "Embeds". Kalau tidak, `embed.js` akan menampilkan
 * kartu cadangan berisi tautan ke Instagram — bukan video yang rusak. Itu
 * perilaku Instagram, bukan bug di sini, dan disampaikan apa adanya lewat
 * teks cadangan di dalam `<noscript>`.
 *
 * Skrip `instagram.com/embed.js` dimuat **hanya** di halaman yang benar-benar
 * punya embed Instagram (lihat `IgEmbed`).
 */

/** URL embed dari ID — host dan ID keduanya sudah tervalidasi di server. */
function embedUrl(host: string | null, id: string): string {
  if (host === "vimeo") return `https://player.vimeo.com/video/${id}`;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Thumbnail YouTube — gratis, tanpa API key. Vimeo/Instagram tidak punya. */
function posterUrl(host: string | null, id: string): string | undefined {
  return host === "vimeo" ? undefined : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Embed Instagram (Reels / IGTV / post).
 *
 * Cara ini mengikuti kode "Embed" yang Instagram berikan sendiri: sebuah
 * `<blockquote>` + skrip `embed.js` yang meng-upgrade-nya jadi player.
 * Alternatifnya adalah memanggil endpoint oEmbed Meta — tapi itu menambah
 * ketergantungan server ke API Meta tanpa mengurangi risiko, jadi tidak
 * dipilih.
 *
 * `data-instgrm-version="14"` adalah versi widget yang dipakai Instagram
 * sendiri; mengikutinya penting supaya embed tidak rusak diam-diam.
 */
function IgEmbed({ shortcode, title }: { shortcode: string; title: string }) {
  return (
    <>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/p/${shortcode}/`}
        data-instgrm-version="14"
        // Tanpa CSS Instagram, blockquote akan tampil sebagai teks mentah
        // sebelum skrip selesai memuat.
        style={{ background: "#000", margin: "0 auto", maxWidth: "540px" }}
      />
      <noscript>
        <a
          href={`https://www.instagram.com/p/${shortcode}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Lihat {title} di Instagram
        </a>
      </noscript>
      {/* dimuat lazy: hanya saat embed benar-benar ada di halaman, dan
          tidak memblokir render. */}
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" async />
    </>
  );
}

export function BeritaMedia({
  item,
  priority = false,
  /** Tampil sebagai kartu di daftar — rasio dibuat tetap seragam antar kartu. */
  compact = false,
}: {
  item: BeritaRow;
  priority?: boolean;
  compact?: boolean;
}) {
  const { imageUrl, imageAlt, videoUrl, videoLink, videoHost, orientasi, judul } = item;

  // Kartu di daftar SELALU 16:9, apa pun orientasi videonya. Alasannya: grid
  // 3 kolom akan ikut meninggi kalau kartu vertikal ikut 9:16, dan baris
  // kartu jadi tidak rata. Di halaman detail (bukan `compact`) orientasi
  // dihormati.
  const vertikalDetail = !compact && orientasi === "vertical";
  const ratio = vertikalDetail ? "berita-media-vertikal" : "aspect-[16/9]";
  const bg = vertikalDetail ? "berita-media-vertikal-bg" : "bg-navy";

  // 1. Instagram Reels / IGTV — butuh skrip, jadi penanganan terpisah.
  if (videoLink && videoHost === "instagram") {
    return (
      <div className={`berita-media-instagram ${compact ? "" : "berita-media-vertikal"}`}>
        <IgEmbed shortcode={videoLink} title={judul} />
      </div>
    );
  }

  // 2. YouTube / Vimeo — iframe.
  if (videoLink) {
    return (
      <div className={`relative w-full overflow-hidden ${bg} ${ratio}`}>
        <iframe
          src={embedUrl(videoHost, videoLink)}
          title={judul}
          loading={priority ? "eager" : "lazy"}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  // 3. Video yang diunggah. `object-contain` dipakai supaya video vertikal
  //    tidak terpotong saat kontainernya 9:16 tapi berkasnya 16:9 (atau
  //    sebaliknya).
  if (videoUrl) {
    return (
      <div className={`relative w-full overflow-hidden ${bg} ${ratio}`}>
        <video
          src={videoUrl}
          controls
          preload={priority ? "metadata" : "none"}
          playsInline
          poster={posterUrl(videoHost, videoLink ?? "")}
          className="absolute inset-0 h-full w-full object-contain"
        >
          Browser Anda tidak mendukung pemutaran video.{" "}
          <a href={videoUrl} className="underline">
            Unduh videonya
          </a>
          .
        </video>
      </div>
    );
  }

  // 4. Foto utama.
  if (imageUrl) {
    return (
      <div className={`relative w-full overflow-hidden bg-line ${ratio}`}>
        <Image
          src={imageUrl}
          alt={imageAlt || judul}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      </div>
    );
  }

  // 5. Tanpa media — placeholder supaya tinggi kartu tetap seragam.
  return (
    <div
      className={`relative w-full overflow-hidden ${bg} ${ratio}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="h-10 w-10 text-white/35"
        >
          <path d="M4 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="m17 10 4-2v8l-4-2z" />
        </svg>
      </div>
    </div>
  );
}
