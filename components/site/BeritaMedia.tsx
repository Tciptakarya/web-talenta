import Image from "next/image";
import type { BeritaRow } from "@/lib/berita-types";

/**
 * Preview media berita: foto utama, atau embed video kalau tidak ada foto.
 *
 * Dua sumber video, keduanya ditangani di sini:
 * - `videoUrl`  → file yang diunggah ke Vercel Blob, diputar dengan `<video>`.
 * - `videoLink` → ID YouTube/Vimeo, diputar dengan `<iframe>`.
 *
 * **Alasan iframe dibangun di sini, bukan dari input admin:** `videoLink` yang
 * disimpan ke database hanya berisi ID hasil `parseVideoLink()` (`yt:ID` /
 * `vm:ID` di DB, sudah dipisah jadi `videoLink` + `videoHost` di `lib/data.ts`).
 * Jadi tidak ada string milik admin yang masuk ke `src` — admin tidak bisa
 * menyuntikkan domain atau atribut lain lewat kolom ini.
 */

/** URL embed dari ID —.host dan ID keduanya sudah tervalidasi di server. */
function embedUrl(host: string | null, id: string): string {
  if (host === "vimeo") return `https://player.vimeo.com/video/${id}`;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Thumbnail YouTube — gratis, tanpa API key. Vimeo tidak menyediakan itu. */
function posterUrl(host: string | null, id: string): string | undefined {
  return host === "vimeo" ? undefined : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function BeritaMedia({
  item,
  priority = false,
  /** Rasio saat tampil sebagai kartu di daftar (lebih pendek dari artikel). */
  compact = false,
}: {
  item: BeritaRow;
  priority?: boolean;
  compact?: boolean;
}) {
  const { imageUrl, imageAlt, videoUrl, videoLink, videoHost, judul } = item;
  const ratio = compact ? "aspect-[16/9]" : "aspect-[16/9]";

  // 1. Video embed (YouTube/Vimeo) — lebih penting daripada foto.
  if (videoLink) {
    return (
      <div className={`relative w-full overflow-hidden bg-navy ${ratio}`}>
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

  // 2. Video yang diunggah.
  if (videoUrl) {
    return (
      <div className={`relative w-full overflow-hidden bg-navy ${ratio}`}>
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

  // 3. Foto utama.
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

  // 4. Tanpa media — placeholder supaya tinggi kartu tetap seragam.
  return (
    <div
      className={`relative w-full overflow-hidden bg-navy ${ratio}`}
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
