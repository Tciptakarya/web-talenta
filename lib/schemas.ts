import { z } from "zod";

/** Validasi input semua endpoint (PRD §8: Zod di endpoint upload & kontak). */

export const contactSchema = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.email("Format email tidak valid").max(200),
  pesan: z.string().trim().min(5, "Pesan minimal 5 karakter").max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Kategori kelas — CRUD dari Admin > Kategori Kelas. */
export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter").max(80),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

/**
 * Meta foto galeri — dipakai upload (/api/upload) DAN edit inline dashboard.
 * Kategori wajib; tahun kegiatan WAJIB (kelompok PROGRAM → TAHUN di galeri
 * publik); program opsional (harus satu kategori — dicek di server)
 * supaya halaman publik bisa memfilter "semua foto Barista" bila diperlukan.
 */
/** Batas tahun: tidak menerima 0 / 99999, tapi tetap mengizinkan arsip lama. */
export const TAHUN_MIN = 1990;
/** +1: mengizinkan foto kegiatan tahun depan yang sudah dijadwalkan. */
export const TAHUN_MAKS = new Date().getFullYear() + 1;

export const gallerySchema = z.object({
  categoryId: z.coerce
    .number()
    .int()
    .positive("Kategori wajib dipilih"),
  programId: z
    .union([z.coerce.number().int().positive(), z.literal("")])
    .optional(),
  year: z.coerce
    .number({ error: "Tahun wajib dipilih." })
    .int("Tahun tidak valid.")
    .min(TAHUN_MIN, "Tahun wajib dipilih.")
    .max(TAHUN_MAKS, `Tahun maksimal ${TAHUN_MAKS}.`),
  caption: z.string().trim().min(2, "Caption minimal 2 karakter").max(200),
  alt: z.string().trim().max(300).optional().or(z.literal("")),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

/** Program/kelas — nama, deskripsi, relasi kategori, dan status aktif. */
export const programSchema = z.object({
  judul: z.string().trim().min(2, "Nama program minimal 2 karakter").max(80),
  deskripsi: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(600),
  categoryId: z.coerce
    .number()
    .int()
    .positive("Kategori wajib dipilih"),
  isActive: z.boolean(),
  urutan: z.coerce.number().int().min(0).max(999).default(0),
});

export const testimonialSchema = z.object({
  nama: z.string().trim().min(2).max(80),
  peran: z.string().trim().min(2).max(120),
  pesan: z.string().trim().min(5).max(600),
  urutan: z.coerce.number().int().min(0).max(999).default(0),
});

/* ---------------------------------- Berita ---------------------------------- */

/**
 * Batas-batas berita. Dipisah dari `MAX_CONTENT_VALUE` (2.000 karakter) yang
 * milik teks statis Tampilan Website — isi berita jauh lebih panjang, jadi
 * batasnya sendiri.
 */
export const BERITA_ISI_MAKS = 20_000;
export const BERITA_RINGKASAN_MAKS = 400;

/**
 * Tipe MIME foto berita. Sama seperti galeri (AVIF sengaja tidak dipakai:
 * thumbnail `<img>` dari AVIF tidak dioptimasi Next).
 */
export const BERITA_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Batas foto berita 8 MB SEBELUM dikompres. */
export const BERITA_IMAGE_BYTES = 8 * 1024 * 1024;

/** Tipe MIME video berita — hanya yang bisa diputar langsung di browser. */
export const BERITA_VIDEO_TYPES = ["video/mp4", "video/webm"];
/**
 * Batas video 200 MB. Video dikirim browser → Vercel Blob LANGSUNG
 * (client-direct lewat `@vercel/blob/client`), jadi batas 4,5 MB per Function
 * milik Vercel TIDAK berlaku untuk video.
 */
export const BERITA_VIDEO_BYTES = 200 * 1024 * 1024;

/** Pola ID video — hanya 11 karakter (YouTube) atau 6-12 digit (Vimeo). */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;
/**
 * Shortcode Instagram. Formatnya berubah beberapa kali; yang aman hanyalah
 * "huruf, angka, garis bawah, strip" dengan panjang masuk akal. Pola longgar
 * ini disengaja: shortcode selalu dipakai untuk membangun URL di server
 * sendiri, jadi karakter yang bisa "keluar dari path" sudah dikecualikan.
 */
const IG_SHORTCODE = /^[A-Za-z0-9_-]{5,60}$/;

/** Host video yang didukung. */
export type VideoHost = "youtube" | "vimeo" | "instagram";

/**
 * Ubah URL YouTube / Vimeo / Instagram jadi `{ host, id }`, atau `null`
 * bila bukan salah satu dari ketiganya.
 *
 * **Hanya ID yang disimpan ke database**, bukan URL penuh. Ini disengaja:
 * komponen publik membangun sendiri URL embed dari ID, jadi admin tidak bisa
 * menyuntikkan domain atau parameter lain lewat kolom ini.
 *
 * Yang diterima:
 * - YouTube: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/shorts/ID`,
 *   `youtube.com/embed/ID`, `youtube.com/live/ID`
 * - Vimeo: `vimeo.com/ID`, `player.vimeo.com/video/ID`
 * - Instagram: `instagram.com/reel/KODE`, `instagram.com/p/KODE`,
 *   `instagram.com/tv/KODE`, `instagr.am/...`
 *
 * **Instagram hanya bisa di-embed jika kontennya PUBLIK** dan creator tidak
 * mematikan pengaturan Embeds. Itu checked Instagram, bukan bisa kita
 * periksa di sini — makanya pesannya jujur, bukan menjanjikan.
 */
export function parseVideoLink(raw: string): { host: VideoHost; id: string } | null {
  const s = raw.trim();
  if (!s) return null;

  const yt = s.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (yt && YOUTUBE_ID.test(yt[1])) return { host: "youtube", id: yt[1] };

  const vm = s.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/);
  if (vm && VIMEO_ID.test(vm[1])) return { host: "vimeo", id: vm[1] };

  // Instagram: hanya path /reel, /p, /tv. Path profil & /stories TIDAK
  // bisa di-embed (dokumentasi resmi Instagram oEmbed), jadi sengaja tidak
  // dicocokkan — supaya admin mendapat pesan error, bukan embed kosong.
  const ig = s.match(
    /(?:instagram\.com|instagr\.com|instagr\.am)\/(?:reel|p|tv)\/([A-Za-z0-9_-]{5,60})/
  );
  if (ig && IG_SHORTCODE.test(ig[1])) return { host: "instagram", id: ig[1] };

  return null;
}

/** Orientasi video — `vertical` untuk YouTube Shorts / Reels (9:16). */
export const ORIENTASI_BERITA = ["horizontal", "vertical"] as const;
export type OrientasiBerita = (typeof ORIENTASI_BERITA)[number];

/** URL thumbnail YouTube — diturunkan dari ID, bukan dari input admin. */
export function videoPosterUrl(videoId: string, host: VideoHost): string | null {
  if (host === "youtube") return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return null; // Vimeo & Instagram tidak menyediakan thumbnail gratis tanpa API key
}

/**
 * Berita/kabar kegiatan — CRUD dari Admin > Berita.
 *
 * `isi` sengaja TIDAK diperlakukan sebagai HTML: isinya teks polos yang
 * di-render aman oleh `renderParagraphs()` di `components/site/BeritaBody.tsx`
 * (escape dulu, baru `**tebal**`/`*miring*`). Jadi tidak ada jalur yang bisa
 * memasukkan HTML mentah.
 */
export const beritaSchema = z
  .object({
    judul: z.string().trim().min(4, "Judul minimal 4 karakter").max(180),
    ringkasan: z
      .string()
      .trim()
      .min(10, "Ringkasan minimal 10 karakter")
      .max(BERITA_RINGKASAN_MAKS, `Ringkasan maksimal ${BERITA_RINGKASAN_MAKS} karakter`),
    isi: z
      .string()
      .trim()
      .min(20, "Isi berita minimal 20 karakter")
      .max(
        BERITA_ISI_MAKS,
        `Isi berita maksimal ${BERITA_ISI_MAKS.toLocaleString("id-ID")} karakter`
      ),
    imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
    imageAlt: z.string().trim().max(300, "Alt teks maksimal 300 karakter").optional().or(z.literal("")),
    videoUrl: z.string().trim().max(500).optional().or(z.literal("")),
    videoLink: z.string().trim().max(300).optional().or(z.literal("")),
    orientasi: z.enum(ORIENTASI_BERITA).default("horizontal"),
    tanggal: z
      .string()
      .trim()
      .min(1, "Tanggal wajib diisi")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
    kategori: z.string().trim().max(40).optional().or(z.literal("")),
    isActive: z.boolean(),
  })
  .refine((d) => !(d.videoUrl && d.videoLink), {
    message:
      "Pilih salah satu: video yang diunggah ATAU link YouTube/Vimeo/Instagram — jangan keduanya.",
    path: ["videoLink"],
  });

export type BeritaInput = z.infer<typeof beritaSchema>;

/** Ganti password admin - wajib ada di produksi (hosting managed tanpa akses shell). */
export const gantiPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter").max(72),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Konfirmasi password tidak sama dengan password baru",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "Password baru harus berbeda dari password lama",
    path: ["newPassword"],
  });

export type GantiPasswordInput = z.infer<typeof gantiPasswordSchema>;

/** Lupa password — hanya email, response generik (§5). */
export const forgotPasswordSchema = z.object({
  email: z.email("Format email tidak valid").max(200),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Token tidak valid").max(200),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter").max(72),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Konfirmasi password tidak sama dengan password baru",
    path: ["confirmPassword"],
  });

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB sebelum kompresi

/* ------------------------------ Email Center ------------------------------ */

/** Batas lampiran email (Resend & diamankan di sisi server). */
export const MAX_EMAIL_ATTACHMENT_BYTES = 8 * 1024 * 1024; // 8 MB per file
export const MAX_EMAIL_ATTACHMENTS = 5;
export const MAX_EMAIL_BODY_CHARS = 100_000;

/** Ekstensi yang DITOLAK (bisa dieksekusi / phishing). */
const BLOCKED_EMAIL_EXT = [
  "exe", "bat", "cmd", "com", "scr", "msi", "msix", "pif", "vbs", "vbe",
  "js", "mjs", "cjs", "jar", "sh", "bash", "ps1", "php", "phtml", "apk",
  "dmg", "app", "hta", "reg", "lnk", "wsf", "wsh",
];

/** Nama file aman: buang path & karakter kontrol, batasi panjang. */
export function safeEmailFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "lampiran";
  const cleaned = base.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return (cleaned || "lampiran").slice(0, 120);
}

/** True bila ekstensi file terlarang. */
export function isBlockedEmailFilename(name: string): boolean {
  const ext = safeEmailFilename(name).split(".").pop()?.toLowerCase() ?? "";
  return BLOCKED_EMAIL_EXT.includes(ext);
}

const emailField = (label: string) =>
  z
    .string()
    .optional()
    .default("")
    .transform((v) =>
      v
        .split(/[;,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .refine((list) => list.every((a) => z.email().safeParse(a).success), {
      message: `Format email ${label} tidak valid. Pisahkan dengan koma.`,
    });

export const emailSendSchema = z.object({
  mode: z.enum(["compose", "reply", "forward"]),
  to: emailField("penerima").refine((v) => v.length > 0, {
    message: "Penerima wajib diisi.",
  }),
  cc: emailField("cc"),
  bcc: emailField("bcc"),
  subject: z
    .string()
    .trim()
    .min(1, "Subjek wajib diisi.")
    .max(300, "Subjek maksimal 300 karakter."),
  body: z
    .string()
    .trim()
    .min(1, "Isi email wajib diisi.")
    .max(MAX_EMAIL_BODY_CHARS, "Isi email terlalu panjang."),
  /** id email asal (untuk reply/teruskan → header threading asli) */
  replyToId: z.coerce.number().int().positive().optional(),
  /** id draft yang sedang diedit (dihapus setelah terkirim) */
  draftId: z.coerce.number().int().positive().optional(),
});

export type EmailSendInput = z.infer<typeof emailSendSchema>;

/**
 * Draft — versi longgar dari `emailSendSchema`: penerima, subjek, dan isi
 * boleh kosong (memang itu wrench draft yang belum selesai), tapi alamat tetap
 * harus valid dan panjang dibatasi.
 */
export const emailDraftSchema = z.object({
  to: emailField("penerima"),
  cc: emailField("cc"),
  bcc: emailField("bcc"),
  subject: z.string().trim().max(300, "Subjek maksimal 300 karakter.").default(""),
  body: z.string().max(MAX_EMAIL_BODY_CHARS, "Isi draft terlalu panjang.").default(""),
  draftId: z.coerce.number().int().positive().optional(),
  replyToId: z.coerce.number().int().positive().optional(),
});

export type EmailDraftInput = z.infer<typeof emailDraftSchema>;

/* ------------------------------ Jadwal Pelatihan ------------------------------ */

export const HARI_LIST = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

/** "2026-09-30" → nama hari Indonesia ("Senin".."Minggu", sinkron dengan HARI_LIST). */
export function hariDariTanggal(tanggalYmd: string): (typeof HARI_LIST)[number] {
  const [y, m, d] = tanggalYmd.split("-").map(Number);
  // Hari kalender dihitung langsung dari tanggal (zona UTC) — konversi ke zona
  // mana pun tidak boleh menggeser nama hari.
  const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const hari = new Intl.DateTimeFormat("id-ID", {
    timeZone: "UTC",
    weekday: "long",
  }).format(utc);
  const nama = hari.charAt(0).toUpperCase() + hari.slice(1);
  if ((HARI_LIST as readonly string[]).includes(nama)) {
    return nama as (typeof HARI_LIST)[number];
  }
  throw new Error(`Tanggal tidak menghasilkan hari yang dikenal: ${tanggalYmd}`);
}

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const tanggalRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Tanggal kalender nyata "YYYY-MM-DD" (cek kabisat & rentang bulan). */
export const tanggalSchema = z
  .string()
  .regex(tanggalRegex, "Format tanggal tidak valid (YYYY-MM-DD)")
  .refine(
    (v) => {
      const m = tanggalRegex.exec(v);
      if (!m) return false;
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const d = Number(m[3]);
      if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
      const dt = new Date(Date.UTC(y, mo - 1, d));
      return (
        dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
      );
    },
    { message: "Tanggal tidak valid (periksa hari/bulan/tahun)" }
  );

/** Jadwal pelatihan — relasi Program → N jadwal, jam pakai format HH:MM. */
export const jadwalSchema = z
  .object({
    programId: z.coerce.number().int().positive("Program wajib dipilih"),
    instruktur: z.string().trim().max(80).optional().or(z.literal("")),
    ruangan: z.string().trim().max(80).optional().or(z.literal("")),
    // Kuota kursi per batch; "" (kosong) = tanpa batas kuota → disimpan null.
    kuota: z
      .union([
        z.coerce
          .number()
          .int()
          .min(1, "Kuota minimal 1 kursi")
          .max(999, "Kuota maksimal 999 kursi"),
        z.literal(""),
      ])
      .optional(),
    hari: z
      .enum(HARI_LIST, "Hari wajib dipilih")
      .optional()
      .or(z.literal("")),
    tanggal: tanggalSchema.optional().or(z.literal("")),
    jamMulai: z.string().regex(timeRegex, "Format jam mulai tidak valid (HH:MM)"),
    jamAkhir: z.string().regex(timeRegex, "Format jam selesai tidak valid (HH:MM)"),
    urutan: z.coerce.number().int().min(0).max(999).default(0),
    isActive: z.boolean(),
  })
  .superRefine((d, ctx) => {
    // Wajib salah satu: tanggal (jadwal satu kali) ATAU hari (jadwal mingguan lama).
    // Bila tanggal diisi, `hari` TIDAK dicek di sini — server selalu menurunkan
    // nama hari dari tanggal, jadi cross-check hanya memblokir edit yang sah.
    if (!d.tanggal && !d.hari) {
      ctx.addIssue({
        code: "custom",
        path: ["tanggal"],
        message: "Tanggal wajib diisi",
      });
    }
  })
  .refine((d) => d.jamAkhir > d.jamMulai, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["jamAkhir"],
  });

export type JadwalInput = z.infer<typeof jadwalSchema>;

/* ------------------------------ Materi Pelatihan ------------------------------ */

export const MATERI_TIPE_LIST = [
  "VIDEO",
  "MODUL CETAK",
  "PDF",
  "SLIDE",
] as const;

export const ALLOWED_MATERI_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/msword", // .doc
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
] as const;

export const MAX_MATERI_BYTES = 10 * 1024 * 1024; // 10MB (di Vercel body limit ~4.5MB → pakai link utk file besar)

/** Materi pelatihan — fileUrl/linkUrl dicek di action (wajib salah satu). */
export const materiSchema = z.object({
  programId: z.coerce.number().int().positive("Program wajib dipilih"),
  judul: z.string().trim().min(3, "Judul materi minimal 3 karakter").max(150),
  tipe: z.enum(MATERI_TIPE_LIST, "Tipe materi wajib dipilih"),
  fileUrl: z.string().trim().max(500).optional().or(z.literal("")),
  linkUrl: z
    .union([z.url("Format URL materi tidak valid"), z.literal("")]),
  urutan: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean(),
});

export type MateriInput = z.infer<typeof materiSchema>;

/* -------------------------------- Pendaftaran -------------------------------- */

/** Status pendaftaran — satu sumber kebenaran untuk API publik & dashboard admin. */
export const PENDAFTARAN_STATUS_LIST = [
  "baru",
  "dikonfirmasi",
  "selesai",
  "ditolak",
] as const;

export type PendaftaranStatus = (typeof PENDAFTARAN_STATUS_LIST)[number];

/**
 * Form pendaftaran publik (POST /api/pendaftaran).
 * `website` = honeypot (input tersembunyi): wajib kosong — bot biasanya mengisinya,
 * sehingga request-nya ditolak tanpa menyimpan data.
 */
export const pendaftaranSchema = z.object({
  jadwalId: z.coerce.number().int().positive("Jadwal tidak valid"),
  nama: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  wa: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(20, "Nomor WhatsApp maksimal 20 karakter")
    .regex(/^[0-9+()\-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  email: z.union([z.email("Format email tidak valid"), z.literal("")]).optional(),
  catatan: z.string().trim().max(500).optional().or(z.literal("")),
  website: z.literal("").optional(), // honeypot — wajib kosong
});

export type PendaftaranInput = z.infer<typeof pendaftaranSchema>;

/** Ubah status pendaftaran dari dashboard admin (/admin/pendaftaran). */
export const pendaftaranStatusSchema = z.enum(
  PENDAFTARAN_STATUS_LIST,
  "Status pendaftaran tidak valid"
);
