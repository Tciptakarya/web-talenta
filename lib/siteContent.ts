/**
 * Registry teks statis website publik — **satu-satunya daftar key** yang boleh
 * diedit dari Admin > Tampilan Website.
 *
 * Prinsip:
 * - `defaultValue` adalah isi website saat ini. Kalau admin belum pernah
 *   mengubah suatu key, halaman publik memakai nilai ini — jadi tabel
 *   `SiteContent` boleh tetap kosong dan situs tidak pernah rusak.
 * - Semua teks di-escape sebelum dirender; `**tebal**` dan `*miring*` adalah
 *   satu-satunya penanda format yang didukung (lihat `renderInline`).
 * - Key baru harus selalu ditambahkan di sini lebih dulu; Server Action
 *   menolak key yang tidak dikenal.
 *
 * Catatan: file ini BUKAN `lib/content.ts` (yang berisi data seed program &
 * galeri v1). Keduanya tidak boleh digabung.
 */
import { prisma } from "@/lib/prisma";

export type ContentField = {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  defaultValue: string;
};

export type ContentSection = {
  id: string;
  title: string;
  description: string;
  fields: ContentField[];
};

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: "hero",
    title: "Hero (bagian atas)",
    description: "Label kecil, judul besar, paragraf pembuka, tombol, dan tiga poin singkat.",
    fields: [
      { key: "hero.badge", label: "Label pill kecil", defaultValue: "LPK & LKP Berizin Resmi" },
      {
        key: "hero.title",
        label: "Judul besar (H1)",
        hint: "Pakai **tebal** atau *miring* sparingly (hemat). Baris baru = <br>.",
        defaultValue: "Temukan Talenta,\nCiptakan *Karya.*",
      },
      {
        key: "hero.lead",
        label: "Paragraf pembuka",
        multiline: true,
        rows: 3,
        defaultValue:
          "Yayasan Talenta Cipta Karya membekali kamu dengan keterampilan nyata lewat program pelatihan yang relevan dengan kebutuhan industri \u2014 dari nol hingga siap kerja.",
      },
      { key: "hero.cta1", label: "Tombol utama", defaultValue: "Lihat Layanan" },
      { key: "hero.cta2", label: "Tombol kedua", defaultValue: "Hubungi Kami" },
      { key: "hero.stat1a", label: "Statistik 1 - judul", defaultValue: "LPK & LKP" },
      { key: "hero.stat1b", label: "Statistik 1 - keterangan", defaultValue: "Terdaftar & berizin resmi" },
      { key: "hero.stat2a", label: "Statistik 2 - judul", defaultValue: "Barista \u00b7 Komputer" },
      { key: "hero.stat2b", label: "Statistik 2 - keterangan", defaultValue: "Bimbel \u00b7 Digital Marketing" },
      { key: "hero.stat3a", label: "Statistik 3 - judul", defaultValue: "Depok, Jawa Barat" },
      { key: "hero.stat3b", label: "Statistik 3 - keterangan", defaultValue: "Lokasi pelatihan" },
      { key: "hero.cardTitle", label: "Kartu kecil - judul", defaultValue: "Kurikulum Berbasis Industri" },
      { key: "hero.cardText", label: "Kartu kecil - keterangan", defaultValue: "Program dirancang bersama mitra dunia usaha" },
    ],
  },
  {
    id: "about",
    title: "Tentang Kami",
    description: "Judul, dua paragraf, dan tiga poin.",
    fields: [
      { key: "about.kicker", label: "Label bagian", defaultValue: "Tentang Kami" },
      { key: "about.title", label: "Judul (H2)", defaultValue: "Ruang belajar untuk siapa pun yang siap berkarya" },
      {
        key: "about.body1",
        label: "Paragraf 1",
        multiline: true,
        rows: 4,
        hint: "Gunakan **teks** untuk menebalkan sebagian.",
        defaultValue:
          "Selamat datang di **Yayasan Talenta Cipta Karya**, tempat kamu mendapatkan pembelajaran berkualitas yang membuka peluang karier. Kami adalah **LPK (Lembaga Pelatihan Kerja)** dan **LKP (Lembaga Kursus dan Pelatihan)** yang telah memiliki izin resmi.",
      },
      {
        key: "about.body2",
        label: "Paragraf 2",
        multiline: true,
        rows: 4,
        defaultValue:
          "Tersedia berbagai kursus dan pelatihan yang dirancang untuk membekali kamu dengan keterampilan yang benar-benar dibutuhkan di dunia kerja \u2014 dari dasar hingga terjun langsung ke industri.",
      },
      { key: "about.bullet1", label: "Poin 1", defaultValue: "Lembaga pelatihan & kursus berizin resmi" },
      { key: "about.bullet2", label: "Poin 2", defaultValue: "Program disusun sesuai kebutuhan industri" },
      { key: "about.bullet3", label: "Poin 3", defaultValue: "Pendampingan dari materi dasar hingga siap kerja" },
    ],
  },
  {
    id: "visimisi",
    title: "Visi & Misi",
    description: "Label, judul, visi, dan empat poin misi.",
    fields: [
      { key: "visimisi.kicker", label: "Label bagian", defaultValue: "Visi & Misi" },
      { key: "visimisi.title", label: "Judul (H2)", defaultValue: "Arah yang menuntun setiap program kami" },
      { key: "visimisi.visiKicker", label: "Label kartu visi", defaultValue: "Visi" },
      {
        key: "visimisi.visi",
        label: "Isi visi",
        multiline: true,
        rows: 3,
        defaultValue:
          "Menjadi lembaga unggul dalam menciptakan sumber daya manusia yang kompeten, kreatif, dan siap kerja di berbagai sektor, berkontribusi pada pembangunan ekonomi dan sosial.",
      },
      { key: "visimisi.misi1", label: "Misi 1", multiline: true, rows: 2, defaultValue: "Menyediakan pendidikan dan pelatihan berkualitas yang sesuai dengan kebutuhan industri." },
      { key: "visimisi.misi2", label: "Misi 2", multiline: true, rows: 2, defaultValue: "Meningkatkan keterampilan dan daya saing peserta melalui program yang relevan dan inovatif." },
      { key: "visimisi.misi3", label: "Misi 3", multiline: true, rows: 2, defaultValue: "Membangun kemitraan dengan dunia usaha untuk membuka peluang kerja dan wirausaha." },
      { key: "visimisi.misi4", label: "Misi 4", multiline: true, rows: 2, defaultValue: "Membekali peserta dengan nilai-nilai profesionalisme dan etika kerja yang tinggi." },
    ],
  },
  {
    id: "layanan",
    title: "Layanan",
    description: "Label, judul, dan keterangan di atas daftar program.",
    fields: [
      { key: "layanan.kicker", label: "Label bagian", defaultValue: "Layanan Kami" },
      {
        key: "layanan.title",
        label: "Judul (H2)",
        hint: "Jumlah program TIDAK ikut berubah otomatis. Kalau bertambah, ubah kata di sini secara manual.",
        defaultValue: "Sebelas jalur pelatihan, satu tujuan: siap kerja",
      },
      { key: "layanan.description", label: "Keterangan (opsional)", multiline: true, rows: 3, defaultValue: "" },
    ],
  },
  {
    id: "jadwal",
    title: "Jadwal Kelas Terdekat",
    description: "Label, judul, keterangan, dan tombol di bagian jadwal.",
    fields: [
      { key: "jadwal.kicker", label: "Label bagian", defaultValue: "Jadwal Kelas Terdekat" },
      { key: "jadwal.title", label: "Judul (H2)", defaultValue: "Kelas berikutnya sudah menunggu jadwalmu" },
      {
        key: "jadwal.description",
        label: "Keterangan",
        multiline: true,
        rows: 3,
        defaultValue:
          "Lihat jadwal pelatihan yang akan datang, lalu klik **Daftar** pada baris yang kamu pilih \u2014 kuota tiap batch terbatas. Masih ada pertanyaan? Hubungi kami lewat WhatsApp.",
      },
      { key: "jadwal.cta1", label: "Tombol WhatsApp", defaultValue: "Tanya Jadwal via WhatsApp" },
      { key: "jadwal.cta2", label: "Tombol lihat semua", defaultValue: "Lihat semua kelas \u2192" },
    ],
  },
  {
    id: "galeri",
    title: "Galeri",
    description: "Label dan judul bagian galeri. Foto & pengelompokannya diatur di menu Galeri.",
    fields: [
      { key: "galeri.kicker", label: "Label bagian", defaultValue: "Galeri" },
      { key: "galeri.title", label: "Judul (H2)", defaultValue: "Dokumentasi kegiatan Talenta Cipta Karya" },
    ],
  },
  {
    id: "lokasi",
    title: "Lokasi",
    description: "Label, judul, keterangan, nama lokasi, rating, dan alamat.",
    fields: [
      { key: "lokasi.kicker", label: "Label bagian", defaultValue: "Lokasi Kami" },
      { key: "lokasi.title", label: "Judul (H2)", defaultValue: "Main ke tempat pelatihan kami" },
      {
        key: "lokasi.description",
        label: "Keterangan",
        multiline: true,
        rows: 3,
        defaultValue:
          "Program Pelatihan Barista berlokasi langsung di kedai mitra kami, gampang ditemukan lewat Google Maps.",
      },
      { key: "lokasi.rating", label: "Label rating", defaultValue: "4,8 \u00b7 Coffee Shop" },
      { key: "lokasi.cardTitle", label: "Judul kartu lokasi", defaultValue: "Ngopi Bareng Teman" },
      {
        key: "lokasi.cardText",
        label: "Keterangan kartu lokasi",
        multiline: true,
        rows: 3,
        defaultValue:
          "Talenta Cipta Karya menjalankan pelatihan Barista langsung di lokasi mitra ini. Konfirmasi jadwal & ketersediaan kelas lewat WhatsApp sebelum datang.",
      },
      { key: "lokasi.cta", label: "Tombol rute", defaultValue: "Rute ke Sini" },
      {
        key: "lokasi.alamat",
        label: "Alamat (kartu cadangan & teks peta)",
        multiline: true,
        rows: 2,
        defaultValue: "Komplek Permata Depok, Sektor Pirus Blok K1 No.16, Pd. Jaya, Kec. Cipayung, Kota Depok",
      },
      { key: "lokasi.petaChip", label: "Label tombol peta", defaultValue: "Buka di Maps" },
    ],
  },
  {
    id: "testimoni",
    title: "Testimoni",
    description: "Label dan judul. Isi testimoni disunting di menu Testimoni.",
    fields: [
      { key: "testimoni.kicker", label: "Label bagian", defaultValue: "Testimoni" },
      { key: "testimoni.title", label: "Judul (H2)", defaultValue: "Cerita dari mereka yang sudah berkarya" },
    ],
  },
  {
    id: "berita",
    title: "Berita",
    description: "Label dan judul bagian Kabar Terbaru di beranda. Isi berita disunting di menu Berita.",
    fields: [
      { key: "berita.kicker", label: "Label bagian", defaultValue: "Kabar Terbaru" },
      { key: "berita.title", label: "Judul (H2)", defaultValue: "Cerita terbaru dari kami" },
      { key: "berita.lihatSemua", label: "Teks tombol", defaultValue: "Lihat Semua Berita" },
    ],
  },
  {
    id: "kontak",
    title: "Kontak",
    description: "Label, judul, keterangan, dan teks tombol kontak.",
    fields: [
      { key: "kontak.kicker", label: "Label bagian", defaultValue: "Hubungi Kami" },
      { key: "kontak.title", label: "Judul (H2)", defaultValue: "Siap memulai langkah pertamamu?" },
      { key: "kontak.description", label: "Keterangan (opsional)", multiline: true, rows: 3, defaultValue: "" },
      { key: "kontak.wa", label: "Nomor WhatsApp (tombol)", defaultValue: "0811-9700-322" },
      { key: "kontak.submit", label: "Teks tombol kirim", defaultValue: "Kirim Pesan" },
      { key: "kontak.loading", label: "Teks tombol saat mengirim", defaultValue: "Mengirim..." },
      { key: "kontak.pesan", label: "Placeholder kolom pesan", defaultValue: "Ceritakan program yang kamu minati..." },
    ],
  },
  {
    id: "navigasi",
    title: "Navbar & Footer",
    description: "Label menu di navbar dan footer, serta teks hak cipta.",
    fields: [
      { key: "nav.berita", label: "Menu - Berita", defaultValue: "Berita" },
      { key: "nav.about", label: "Menu - Tentang Kami", defaultValue: "Tentang Kami" },
      { key: "nav.visimisi", label: "Menu - Visi & Misi", defaultValue: "Visi & Misi" },
      { key: "nav.layanan", label: "Menu - Layanan", defaultValue: "Layanan" },
      { key: "nav.jadwal", label: "Menu - Jadwal", defaultValue: "Jadwal" },
      { key: "nav.galeri", label: "Menu - Galeri", defaultValue: "Galeri" },
      { key: "nav.lokasi", label: "Menu - Lokasi", defaultValue: "Lokasi" },
      { key: "nav.testimoni", label: "Menu - Testimoni", defaultValue: "Testimoni" },
      { key: "nav.kontak", label: "Menu - Kontak", defaultValue: "Kontak" },
      { key: "footer.copyright", label: "Teks hak cipta", hint: "Tulisan {year} diganti otomatis dengan tahun berjalan.", defaultValue: "© {year} Talenta Cipta Karya. Semua hak dilindungi." },
    ],
  },
];

/** Semua key yang valid, dalam urutan kemunculan. */
export const ALL_CONTENT_KEYS: string[] = CONTENT_SECTIONS.flatMap((s) =>
  s.fields.map((f) => f.key)
);

const DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.key, f.defaultValue]))
);

export const MAX_CONTENT_VALUE = 2000;

export type ContentMap = Record<string, string>;

/** Nilai efektif untuk satu key: yang tersimpan di DB, atau nilai bawaan. */
export function textOf(map: ContentMap, key: string): string {
  const v = map[key];
  return v !== undefined && v !== null ? v : (DEFAULTS[key] ?? "");
}

/** Nilai bawaan (untuk tombol "Kembalikan ke bawaan"). */
export function defaultOf(key: string): string {
  return DEFAULTS[key] ?? "";
}

/** Ganti placeholder {year} dengan tahun berjalan. */
export function withYear(text: string): string {
  return text.replace(/\{year\}/g, String(new Date().getFullYear()));
}

/**
 * Escape HTML, lalu ubah `**tebal**` → `<strong>`, `*miring*` → `<em>`,
 * dan baris baru → `<br />`.
 *
 * Urutannya penting: escape DULU, baru sisipkan tag. Jadi teks dari admin
 * tidak pernah bisa menyuntikkan HTML/JS apa pun.
 */
export function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

/** Ambil semua key yang tersimpan, dalam satu query. */
export async function getContentMap(): Promise<ContentMap> {
  const rows = await prisma.siteContent.findMany({ select: { key: true, value: true } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/**
 * Simpan nilai dari form.
 *
 * - Key di luar registry diabaikan.
 * - Nilai yang **sama dengan bawaan** tidak disimpan, dan bila sebelumnya ada
 *   nilai tersimpan untuk key itu, nilainya dihapus (kembali ke bawaan).
 *   Jadi tabel hanya berisi teks yang benar-benar diubah admin.
 */
export async function saveContentValues(values: Record<string, string>): Promise<number> {
  // Prisma hanya menerima PrismaPromise di dalam $transaction, jadi hasil
  // tiap operasi dikumpulkan terpisah (tidak pakai .then di dalam array).
  const plans: { key: string; value: string }[] = [];
  const toDelete: string[] = [];

  for (const [key, value] of Object.entries(values)) {
    if (!ALL_CONTENT_KEYS.includes(key) || typeof value !== "string") continue;
    const v = value.slice(0, MAX_CONTENT_VALUE);
    if (v === defaultOf(key)) toDelete.push(key);
    else plans.push({ key, value: v });
  }

  if (plans.length === 0 && toDelete.length === 0) return 0;

  await prisma.$transaction([
    ...plans.map((d) =>
      prisma.siteContent.upsert({
        where: { key: d.key },
        create: { key: d.key, value: d.value },
        update: { value: d.value },
      })
    ),
    ...(toDelete.length ? [prisma.siteContent.deleteMany({ where: { key: { in: toDelete } } })] : []),
  ]);

  return plans.length + toDelete.length;
}

/** Hapus nilai tersimpan → kembali ke bawaan. */
export async function resetContentValues(keys: string[]): Promise<number> {
  const valid = keys.filter((k) => ALL_CONTENT_KEYS.includes(k));
  if (valid.length === 0) return 0;
  const res = await prisma.siteContent.deleteMany({ where: { key: { in: valid } } });
  return res.count;
}
