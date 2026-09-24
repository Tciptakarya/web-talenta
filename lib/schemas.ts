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

/** Upload galeri — kategori sekarang relasi Category (bukan string bebas). */
export const uploadSchema = z.object({
  categoryId: z.coerce
    .number()
    .int()
    .positive("Kategori wajib dipilih"),
  caption: z.string().trim().min(2, "Caption minimal 2 karakter").max(200),
  alt: z.string().trim().max(300).optional().or(z.literal("")),
});

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

/** Ganti password admin — wajib ada di produksi (hosting managed tanpa akses shell). */
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

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Jadwal pelatihan — relasi Program → N jadwal, jam pakai format HH:MM. */
export const jadwalSchema = z
  .object({
    programId: z.coerce.number().int().positive("Program wajib dipilih"),
    instruktur: z.string().trim().max(80).optional().or(z.literal("")),
    ruangan: z.string().trim().max(80).optional().or(z.literal("")),
    hari: z.enum(HARI_LIST, "Hari wajib dipilih"),
    jamMulai: z.string().regex(timeRegex, "Format jam mulai tidak valid (HH:MM)"),
    jamAkhir: z.string().regex(timeRegex, "Format jam selesai tidak valid (HH:MM)"),
    urutan: z.coerce.number().int().min(0).max(999).default(0),
    isActive: z.boolean(),
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
