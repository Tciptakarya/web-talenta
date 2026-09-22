import "server-only";
import { prisma } from "@/lib/prisma";
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
