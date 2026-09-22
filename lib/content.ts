// Konten statis v1 yang jadi fallback & data seed.
// Sumber utama di produksi: database (lihat lib/data.ts).

export type DefaultProgram = {
  judul: string;
  slug: string;
  deskripsi: string;
  categorySlug?: string; // relasi kategori (fallback)
};

export const PROGRAMS: DefaultProgram[] = [
  {
    judul: "Pelatihan Barista",
    slug: "pelatihan-barista",
    categorySlug: "barista",
    deskripsi:
      "Mempelajari sejarah, jenis-jenis kopi, hingga teknik dasar dan lanjutan dalam meracik kopi ala profesional.",
  },
  {
    judul: "Kursus Komputer",
    slug: "kursus-komputer",
    categorySlug: "kelas-komputer",
    deskripsi:
      "Dari pemula hingga tingkat lanjutan — mencakup Microsoft Office, pemrograman, hingga desain grafis.",
  },
  {
    judul: "Bimbingan Belajar",
    slug: "bimbingan-belajar",
    categorySlug: "bimbingan-belajar",
    deskripsi:
      "Mendukung siswa memahami materi sekolah dengan pendekatan interaktif, menyenangkan, dan mudah dipahami.",
  },
  {
    judul: "Digital Marketing",
    slug: "digital-marketing",
    categorySlug: "digital-marketing",
    deskripsi:
      "Belajar SEO, media sosial, iklan online, dan analitik untuk memajukan bisnis maupun karier di era digital.",
  },
  {
    judul: "Pelatihan K3",
    slug: "pelatihan-k3",
    categorySlug: "pelatihan-k3",
    deskripsi:
      "Pelatihan Keselamatan dan Kesehatan Kerja (K3) untuk memenuhi standar keamanan industri dan perlindungan tenaga kerja.",
  },
  {
    judul: "BOSIET",
    slug: "bosiet",
    categorySlug: "keselamatan-maritim",
    deskripsi:
      "Basic Offshore Safety Induction and Emergency Training — sertifikasi keselamatan standar internasional untuk pekerja lepas pantai.",
  },
  {
    judul: "Basic Safety Training",
    slug: "basic-safety-training",
    categorySlug: "keselamatan-maritim",
    deskripsi:
      "Pelatihan keselamatan dasar maritim mencakup penyelamatan pribadi, kebakaran, pertolongan pertama, dan keselamatan pribadi.",
  },
  {
    judul: "Basic Sea Survival",
    slug: "basic-sea-survival",
    categorySlug: "keselamatan-maritim",
    deskripsi:
      "Pelatihan bertahan hidup di laut meliputi penggunaan perahu penyelamatan, jacket pelampung, dan teknik bertahan hidup di air terbuka.",
  },
  {
    judul: "Basic Fire & First Aid",
    slug: "basic-fire-first-aid",
    categorySlug: "keselamatan-maritim",
    deskripsi:
      "Pelatihan pemadaman kebakaran dasar dan pertolongan pertama kecelakaan kerja untuk respons cepat dan penanganan darurat.",
  },
  {
    judul: "Pelatihan Kendaraan Listrik",
    slug: "pelatihan-kendaraan-listrik",
    categorySlug: "kendaraan-listrik",
    deskripsi:
      "Pelatihan teknologi kendaraan listrik mulai dari dasar sistem EV, perawatan baterai, hingga diagnostik dan perbaikan komponen kendaraan listrik.",
  },
  {
    judul: "Pelatihan Tata Boga",
    slug: "pelatihan-tata-boga",
    categorySlug: "tata-boga",
    deskripsi:
      "Pelatihan memasak dari dasar hingga mahir — teknik olah pangan, plating, dan manajemen dapur untuk bekal wirausaha kuliner atau bekerja di industri F&B.",
  },
];

export type DefaultTestimonial = { nama: string; peran: string; pesan: string };

export const TESTIMONIALS: DefaultTestimonial[] = [
  {
    nama: "Andi",
    peran: "Alumni Pelatihan Barista",
    pesan:
      "Pelatihannya sangat bermanfaat! Saya kini bekerja sebagai barista di kafe ternama.",
  },
  {
    nama: "Budi",
    peran: "Alumni Kursus Komputer",
    pesan:
      "Kursus komputer ini benar-benar meningkatkan skill saya dalam dunia kerja.",
  },
];

export type DefaultGalleryImage = {
  url: string;
  kategoriSlug: string; // slug Category ("barista" | "kelas-komputer" | ...)
  caption: string;
  alt: string;
};

export const GALLERY_IMAGES: DefaultGalleryImage[] = [
  { url: "/images/gallery/barista-01.jpg", kategoriSlug: "barista", caption: "Wisuda Peserta Pelatihan Barista", alt: "Wisuda Peserta Pelatihan Barista" },
  { url: "/images/gallery/barista-02.jpg", kategoriSlug: "barista", caption: "Penyerahan Sertifikat", alt: "Penyerahan Sertifikat" },
  { url: "/images/gallery/barista-03.jpg", kategoriSlug: "barista", caption: "Foto Bersama Peserta", alt: "Foto Bersama Peserta Pelatihan Barista" },
  { url: "/images/gallery/barista-04.jpg", kategoriSlug: "barista", caption: "Sesi Pembukaan Pelatihan", alt: "Sesi Pembukaan Pelatihan Barista Disnaker Kota Depok" },
  { url: "/images/gallery/barista-05.jpg", kategoriSlug: "barista", caption: "Materi & Teori di Kelas", alt: "Materi Kelas Barista" },
  { url: "/images/gallery/barista-06.jpg", kategoriSlug: "barista", caption: "Praktik & Diskusi Kelompok", alt: "Praktik dan Diskusi Kelompok" },
  { url: "/images/gallery/kelas-komputer-scratch-01.jpeg", kategoriSlug: "kelas-komputer", caption: "Pengenalan Scratch & Gerak Dasar", alt: "Peserta mengikuti kelas komputer dengan materi Scratch dan gerak dasar" },
  { url: "/images/gallery/kelas-komputer-scratch-02.jpeg", kategoriSlug: "kelas-komputer", caption: "Belajar Komputer Bersama", alt: "Peserta belajar komputer bersama di ruang kelas" },
  { url: "/images/gallery/kelas-komputer-scratch-03.jpeg", kategoriSlug: "kelas-komputer", caption: "Praktik Pemrograman Scratch", alt: "Peserta mempraktikkan pemrograman visual menggunakan Scratch" },
  { url: "/images/gallery/kelas-komputer-scratch-06.jpeg", kategoriSlug: "kelas-komputer", caption: "Sesi Pembelajaran Digital", alt: "Sesi pembelajaran digital di ruang kelas komputer" },
  { url: "/images/gallery/kelas-komputer-scratch-07.jpeg", kategoriSlug: "kelas-komputer", caption: "Diskusi Peserta Kelas", alt: "Peserta berdiskusi dalam kelas komputer" },
  { url: "/images/gallery/kelas-komputer-scratch-08.jpeg", kategoriSlug: "kelas-komputer", caption: "Praktik Komputer Mandiri", alt: "Peserta melakukan praktik komputer secara mandiri" },
];

/** Kategori fallback (dipakai hanya bila database tidak tersedia). */
export type DefaultCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
};

export const CATEGORIES: DefaultCategory[] = [
  {
    id: 1,
    name: "Barista",
    slug: "barista",
    description: "Suasana belajar dan berlatih di Kelas Barista",
    image: null,
    isActive: true,
  },
  {
    id: 2,
    name: "Kelas Komputer",
    slug: "kelas-komputer",
    description: "Belajar, mencoba, dan berkarya bersama",
    image: null,
    isActive: true,
  },
  {
    id: 3,
    name: "Tata Boga",
    slug: "tata-boga",
    description: "Program pelatihan Tata Boga — dari dasar hingga mahir",
    image: null,
    isActive: true,
  },
  {
    id: 4,
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Program pelatihan Digital Marketing",
    image: null,
    isActive: true,
  },
  {
    id: 5,
    name: "Bimbingan Belajar",
    slug: "bimbingan-belajar",
    description: null,
    image: null,
    isActive: true,
  },
  {
    id: 6,
    name: "Pelatihan K3",
    slug: "pelatihan-k3",
    description: null,
    image: null,
    isActive: true,
  },
  {
    id: 7,
    name: "Keselamatan Maritim",
    slug: "keselamatan-maritim",
    description: null,
    image: null,
    isActive: true,
  },
  {
    id: 8,
    name: "Pelatihan Kendaraan Listrik",
    slug: "kendaraan-listrik",
    description: null,
    image: null,
    isActive: true,
  },
];
