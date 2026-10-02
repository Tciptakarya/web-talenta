/**
 * Tipe baris Berita — **tanpa** `import "server-only"`, jadi boleh dipakai di
 * Client Component (`BeritaCard`, `BeritaList`) maupun Server Component.
 *
 * Dipisah dari `lib/data.ts` karena file itu menandai dirinya `server-only`
 * (Prisma hanya jalan di server). `lib/data.ts` meng-`export` ulang tipe ini,
 * jadi import lama `from "@/lib/data"` tetap bekerja.
 */
export type BeritaRow = {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;
  imageUrl: string | null;
  imageAlt: string | null;
  videoUrl: string | null;
  /**
   * ID video saja (tanpa host) hasil `parseVideoLink()`, atau `null`.
   * Di database disimpan sebagai `yt:<id>` / `vm:<id>` / `ig:<shortcode>`;
   * pemisahan prefix terjadi di `beritaRows()` (`lib/data.ts`).
   */
  videoLink: string | null;
  /** "youtube" | "vimeo" | "instagram" — ikut tersimpan agar publik tak perlu menebak. */
  videoHost: "youtube" | "vimeo" | "instagram" | null;
  /**
   * Orientasi video: "horizontal" (16:9) | "vertical" (9:16, untuk
   * YouTube Shorts & Reels). Nilai di luar itu dinormalkan menjadi
   * "horizontal" di `beritaRows()`.
   */
  orientasi: "horizontal" | "vertical";
  tanggal: Date;
  kategori: string | null;
  isActive: boolean;
};
