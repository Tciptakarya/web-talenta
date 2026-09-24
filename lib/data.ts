import "server-only";
import { prisma } from "@/lib/prisma";
import { HARI_LIST } from "@/lib/schemas";
import {
  CATEGORIES,
  GALLERY_IMAGES,
  PROGRAMS,
  TESTIMONIALS,
} from "@/lib/content";

/** Baris kategori (bisa dari DB maupun fallback). */
export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
};

export type ProgramRow = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  urutan: number;
  isActive: boolean;
  categoryId: number | null;
  category: CategoryRow | null;
};

export type GalleryRow = {
  id: number;
  url: string;
  caption: string;
  alt: string | null;
  urutan: number;
  categoryId: number | null;
  category: CategoryRow | null;
};

export type TestimonialRow = {
  id: number;
  nama: string;
  peran: string;
  pesan: string;
  urutan: number;
};

/**
 * Query data publik. Jika database belum tersedia (mis. belum `npm run db:setup`),
 * situs tetap tampil penuh memakai konten v1 dari lib/content.ts.
 */
async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error("[data] query DB gagal, memakai fallback konten v1:", err);
    return fallback;
  }
}

/** Cari baris kategori fallback berdasarkan slug (untuk mode offline). */
function fallbackCategory(slug: string): CategoryRow | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/* ── Kategori ──────────────────────────────────────────────────── */

/** Semua kategori (termasuk non-aktif) — untuk admin. */
export async function getCategories(): Promise<CategoryRow[]> {
  return safe(
    async () => {
      const rows = await prisma.category.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
      });
      return rows.length > 0 ? rows : CATEGORIES;
    },
    CATEGORIES
  );
}

/** Hanya kategori aktif — untuk halaman publik (/kelas & chip filter). */
export async function getActiveCategories(): Promise<CategoryRow[]> {
  return safe(
    async () => {
      const rows = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
      return rows.length > 0 ? rows : CATEGORIES.filter((c) => c.isActive);
    },
    CATEGORIES.filter((c) => c.isActive)
  );
}

/** Kategori + jumlah program/foto — untuk daftar admin & kartu /kelas. */
export async function getCategoriesWithCounts() {
  return safe(
    async () => {
      const rows = await prisma.category.findMany({
        orderBy: [{ isActive: "desc" }, { name: "asc" }],
        include: {
          _count: { select: { programs: true, galleryImages: true } },
        },
      });
      return rows;
    },
    CATEGORIES.map((c) => ({
      ...c,
      _count: { programs: 0, galleryImages: 0 },
    }))
  );
}

/** Cari kategori berdasarkan slug — halaman /kelas/[slug] (SEO pakai slug, bukan id). */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRow | null> {
  return safe(
    async () => {
      const row = await prisma.category.findUnique({ where: { slug } });
      return row ?? null;
    },
    fallbackCategory(slug)
  );
}

/* ── Program ───────────────────────────────────────────────────── */

/** Program aktif + relasi kategorinya (publik). */
export async function getPrograms(): Promise<ProgramRow[]> {
  return safe(
    async () => {
      const rows = await prisma.program.findMany({
        where: { isActive: true },
        orderBy: { urutan: "asc" },
        include: { category: true },
      });
      if (rows.length > 0) return rows;
      return PROGRAMS.map((p, i) => ({
        id: i + 1,
        urutan: i + 1,
        isActive: true,
        categoryId: fallbackCategory(p.categorySlug ?? "")?.id ?? null,
        category: p.categorySlug ? fallbackCategory(p.categorySlug) : null,
        judul: p.judul,
        slug: p.slug,
        deskripsi: p.deskripsi,
      }));
    },
    PROGRAMS.map((p, i) => ({
      id: i + 1,
      urutan: i + 1,
      isActive: true,
      categoryId: fallbackCategory(p.categorySlug ?? "")?.id ?? null,
      category: p.categorySlug ? fallbackCategory(p.categorySlug) : null,
      judul: p.judul,
      slug: p.slug,
      deskripsi: p.deskripsi,
    }))
  );
}

/** Semua program termasuk non-aktif — untuk admin. */
export async function getAllPrograms(): Promise<ProgramRow[]> {
  return safe(
    async () => {
      const rows = await prisma.program.findMany({
        orderBy: { urutan: "asc" },
        include: { category: true },
      });
      if (rows.length > 0) return rows;
      // Fallback ke konten statis
      return PROGRAMS.map((p, i) => ({
        id: i + 1,
        urutan: i + 1,
        isActive: true,
        categoryId: fallbackCategory(p.categorySlug ?? "")?.id ?? null,
        category: p.categorySlug ? fallbackCategory(p.categorySlug) : null,
        judul: p.judul,
        slug: p.slug,
        deskripsi: p.deskripsi,
      }));
    },
    PROGRAMS.map((p, i) => ({
      id: i + 1,
      urutan: i + 1,
      isActive: true,
      categoryId: fallbackCategory(p.categorySlug ?? "")?.id ?? null,
      category: p.categorySlug ? fallbackCategory(p.categorySlug) : null,
      judul: p.judul,
      slug: p.slug,
      deskripsi: p.deskripsi,
    }))
  );
}

/** Program per kategori — via relasi (bukan pencocokan string). */
export async function getProgramsByCategory(
  categoryId: number
): Promise<ProgramRow[]> {
  const all = await getPrograms();
  return all.filter((p) => p.categoryId === categoryId);
}

/* ── Galeri ────────────────────────────────────────────────────── */

export async function getGallery(): Promise<GalleryRow[]> {
  return safe(
    async () => {
      const rows = await prisma.galleryImage.findMany({
        orderBy: [{ urutan: "asc" }, { uploadedAt: "desc" }],
        include: { category: true },
      });
      if (rows.length > 0) return rows;
      return GALLERY_IMAGES.map((g, i) => ({
        id: i + 1,
        urutan: i + 1,
        caption: g.caption,
        alt: g.alt,
        url: g.url,
        categoryId: fallbackCategory(g.kategoriSlug)?.id ?? null,
        category: fallbackCategory(g.kategoriSlug),
      }));
    },
    GALLERY_IMAGES.map((g, i) => ({
      id: i + 1,
      urutan: i + 1,
      caption: g.caption,
      alt: g.alt,
      url: g.url,
      categoryId: fallbackCategory(g.kategoriSlug)?.id ?? null,
      category: fallbackCategory(g.kategoriSlug),
    }))
  );
}

/** Galeri per kategori — via relasi Category → GalleryImage. */
export async function getGalleryByCategory(categoryId: number) {
  const all = await getGallery();
  return all.filter((g) => g.categoryId === categoryId);
}

/* ── Jadwal & Materi Pelatihan ────────────────────────────────── */

export type JadwalRow = {
  id: number;
  instruktur: string | null;
  ruangan: string | null;
  hari: string;
  jamMulai: string;
  jamAkhir: string;
  programId: number;
  program: { id: number; judul: string; slug: string };
};

export type MateriRow = {
  id: number;
  judul: string;
  tipe: string;
  fileUrl: string | null;
  linkUrl: string | null;
  programId: number;
  program: { id: number; judul: string; slug: string };
};

/** Jadwal aktif per kategori — untuk tabel jadwal di /kelas/[slug]. */
export async function getJadwalByCategory(
  categoryId: number
): Promise<JadwalRow[]> {
  return safe(async () => {
    return await prisma.jadwalPelatihan.findMany({
      where: { isActive: true, program: { categoryId, isActive: true } },
      include: {
        program: { select: { id: true, judul: true, slug: true } },
      },
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    });
  }, []);
}

/**
 * Materi aktif per kategori.
 * CATATAN: materi tidak lagi ditampilkan di halaman publik /kelas/[slug];
 * helper ini disimpan untuk keperluan admin/ekspor mendatang.
 */
export async function getMateriByCategory(
  categoryId: number
): Promise<MateriRow[]> {
  return safe(async () => {
    return await prisma.materiPelatihan.findMany({
      where: { isActive: true, program: { categoryId, isActive: true } },
      include: {
        program: { select: { id: true, judul: true, slug: true } },
      },
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    });
  }, []);
}

/* ── Jadwal Kelas Terdekat (landing page) ─────────────────────── */

export type UpcomingJadwalRow = {
  id: number;
  instruktur: string | null;
  ruangan: string | null;
  hari: string;
  jamMulai: string;
  jamAkhir: string;
  programId: number;
  program: { id: number; judul: string; slug: string; categorySlug: string | null };
  /** 0 = hari ini, 1 = besok, 7 = pekan depan (jadwal hari ini sudah lewat). */
  offsetDays: number;
};

/** Jam & hari saat ini dalam WIB (Asia/Jakarta) — WIB = zona waktu input jadwal. */
function wibNow(now: Date): { dayIdx: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  // 0 = Senin … 6 = Minggu — sinkron dengan urutan HARI_LIST.
  const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const idx = order.indexOf(weekday);
  return { dayIdx: idx < 0 ? 0 : idx, minutes: (hour % 24) * 60 + (minute % 60) };
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}

/**
 * Jadwal aktif paling dekat untuk section landing "Jadwal Kelas Terdekat".
 * Diurutkan berdasarkan occurrence berikutnya (zona Asia/Jakarta): jadwal hari
 * ini yang sudah selesai digeser ke pekan depan; yang sedang berlangsung tetap
 * hari ini. Maksimal `limit` baris.
 */
export async function getUpcomingJadwal(
  limit = 8
): Promise<UpcomingJadwalRow[]> {
  const rows = await safe(async () => {
    return await prisma.jadwalPelatihan.findMany({
      where: { isActive: true, program: { isActive: true } },
      include: {
        program: {
          select: {
            id: true,
            judul: true,
            slug: true,
            urutan: true,
            category: { select: { slug: true, isActive: true } },
          },
        },
      },
    });
  }, [] as (JadwalRow & {
    program: {
      id: number;
      judul: string;
      slug: string;
      urutan: number;
      category: { slug: string; isActive: boolean } | null;
    };
  })[]);

  const { dayIdx, minutes } = wibNow(new Date());

  return rows
    // Sembunyikan program non-aktif kategori (kategori null tetap tampil → link /kelas).
    .filter((j) => !j.program.category || j.program.category.isActive)
    .map((j) => {
      const target = HARI_LIST.indexOf(
        j.hari as (typeof HARI_LIST)[number]
      );
      let offsetDays = 99; // hari tidak dikenal → urutkan paling akhir
      if (target >= 0) {
        offsetDays = (target - dayIdx + 7) % 7;
        // Sudah lewat hari ini → tampil sebagai jadwal pekan depan.
        if (offsetDays === 0 && minutes >= hhmmToMinutes(j.jamAkhir)) {
          offsetDays = 7;
        }
      }
      return {
        id: j.id,
        instruktur: j.instruktur,
        ruangan: j.ruangan,
        hari: j.hari,
        jamMulai: j.jamMulai,
        jamAkhir: j.jamAkhir,
        programId: j.programId,
        program: {
          id: j.program.id,
          judul: j.program.judul,
          slug: j.program.slug,
          categorySlug: j.program.category?.slug ?? null,
        },
        offsetDays,
        _sort: offsetDays * 1440 + hhmmToMinutes(j.jamMulai),
        _tie: j.program.urutan * 10000 + j.id,
      };
    })
    .sort((a, b) => a._sort - b._sort || a._tie - b._tie)
    .slice(0, Math.max(0, limit))
    .map(({ _sort: _s, _tie: _t, ...row }) => row);
}

/**
 * Galeri dikelompokkan per kategori aktif untuk section galeri di beranda.
 * Dinamis dari DB — tanpa hardcode "Barista"/"Komputer".
 */
export async function getGalleryGroups(): Promise<{
  groups: { category: CategoryRow; items: GalleryRow[] }[];
  lainnya: GalleryRow[];
}> {
  const [cats, all] = await Promise.all([getActiveCategories(), getGallery()]);
  const groups = cats
    .map((category) => ({
      category,
      items: all.filter((g) => g.categoryId === category.id),
    }))
    .filter((g) => g.items.length > 0);
  const activeIds = new Set(cats.map((c) => c.id));
  const lainnya = all.filter((g) => !g.categoryId || !activeIds.has(g.categoryId));
  return { groups, lainnya };
}

/* ── Testimoni ─────────────────────────────────────────────────── */

export async function getTestimonials(): Promise<TestimonialRow[]> {
  return safe(
    async () => {
      const rows = await prisma.testimonial.findMany({ orderBy: { urutan: "asc" } });
      return rows.length > 0
        ? rows
        : TESTIMONIALS.map((t, i) => ({ id: i + 1, urutan: i + 1, ...t }));
    },
    TESTIMONIALS.map((t, i) => ({ id: i + 1, urutan: i + 1, ...t }))
  );
}
