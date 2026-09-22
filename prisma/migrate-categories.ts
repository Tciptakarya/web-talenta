// Migrasi aman (backward compatibility §11):
//   string kategori lama  →  record Category + relasi FK
//   "Barista"     → Category: Barista (slug: barista)
//   "Komputer"    → Category: Kelas Komputer (slug: kelas-komputer)
//   string lain   → Category baru dibuat otomatis (slug unik)
// Program juga dipetakan: barista/komputer/tata-boga/digital-marketing.
// Idempoten — aman dijalankan berulang.
//
// Jalankan: npx tsx prisma/migrate-categories.ts
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

/** Kategori default yang dikenal (sinkron dengan prisma/seed.ts). */
const DEFAULT_CATEGORIES: { name: string; slug: string; description: string | null }[] = [
  {
    name: "Barista",
    slug: "barista",
    description: "Suasana belajar dan berlatih di Kelas Barista",
  },
  {
    name: "Kelas Komputer",
    slug: "kelas-komputer",
    description: "Belajar, mencoba, dan berkarya bersama",
  },
  {
    name: "Tata Boga",
    slug: "tata-boga",
    description: "Program pelatihan Tata Boga — dari dasar hingga mahir",
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Program pelatihan Digital Marketing",
  },
  { name: "Bimbingan Belajar", slug: "bimbingan-belajar", description: null },
  { name: "Pelatihan K3", slug: "pelatihan-k3", description: null },
  {
    name: "Keselamatan Maritim",
    slug: "keselamatan-maritim",
    description: null,
  },
  {
    name: "Pelatihan Kendaraan Listrik",
    slug: "kendaraan-listrik",
    description: null,
  },
];

/** Alias string lama → slug kategori (mis. "Komputer" → "kelas-komputer"). */
function resolveSlug(raw: string): string {
  const s = slugify(raw);
  if (s === "komputer" || s === "kelas-komputer" || s.includes("kelas-komputer")) {
    return "kelas-komputer";
  }
  return s;
}

/** Pastikan kategori dengan slug tsb ada; buat bila belum. */
async function ensureCategory(name: string, slug: string, description?: string) {
  const cat = prisma.category.upsert({
    where: { slug },
    update: description ? { description } : {},
    create: { name, slug, description: description ?? null, isActive: true },
  });
  return cat;
}

async function main() {
  console.log("1. Memastikan kategori default ada...");
  const catByName = new Map<string, number>();
  for (const c of DEFAULT_CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { name: c.name, slug: c.slug, description: c.description, isActive: true },
    });
    catByName.set(c.name, cat.id);
    catByName.set(c.slug, cat.id);
  }

  console.log("2. Backfill GalleryImage.kategori (string) → categoryId...");
  // Kolom legacy `kategori` sudah dihapus dari schema — dilewati bila tidak ada
  // (backfill pertama kali dijalankan sebelum kolom dihapus).
  const hasLegacyColumn = await prisma.$queryRaw<
    { cnt: number }[]
  >`SELECT COUNT(*) as cnt FROM pragma_table_info('GalleryImage') WHERE name='kategori'`;

  if (Number(hasLegacyColumn[0]?.cnt ?? 0) > 0) {
    const images = await prisma.$queryRaw<
      { id: number; kategori: string | null; categoryId: number | null }[]
    >`SELECT id, kategori, categoryId FROM GalleryImage`;

    let migratedImages = 0;
    for (const img of images) {
      if (img.categoryId) continue;
      const raw = (img.kategori ?? "").trim();
      const slug = raw ? resolveSlug(raw) : "lainnya";
      const known = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
      const name = known?.name ?? raw ?? "Lainnya";
      const cat = await ensureCategory(name, slug, known?.description ?? undefined);
      await prisma.galleryImage.update({
        where: { id: img.id },
        data: { categoryId: cat.id },
      });
      migratedImages++;
    }
    console.log(`   foto dimigrasi: ${migratedImages}`);
  } else {
    console.log("   kolom legacy tidak ada — dilewati (sudah termigrasi).");
  }

  console.log("3. Backfill Program → categoryId (pemetaan slug)...");
  const PROGRAM_MAP: Record<string, string> = {
    "pelatihan-barista": "barista",
    "kursus-komputer": "kelas-komputer",
    "pelatihan-tata-boga": "tata-boga",
    "digital-marketing": "digital-marketing",
    "bimbingan-belajar": "bimbingan-belajar",
    "pelatihan-k3": "pelatihan-k3",
    "bosiet": "keselamatan-maritim",
    "basic-safety-training": "keselamatan-maritim",
    "basic-sea-survival": "keselamatan-maritim",
    "basic-fire-first-aid": "keselamatan-maritim",
    "pelatihan-kendaraan-listrik": "kendaraan-listrik",
  };
  const programs = await prisma.program.findMany({
    select: { id: true, slug: true, judul: true, categoryId: true },
  });
  let migratedPrograms = 0;
  for (const p of programs) {
    if (p.categoryId) continue;
    const targetSlug = PROGRAM_MAP[p.slug];
    if (!targetSlug) continue;
    const def = DEFAULT_CATEGORIES.find((c) => c.slug === targetSlug);
    const cat = def
      ? await ensureCategory(def.name, def.slug, def.description ?? undefined)
      : await ensureCategory(p.judul, targetSlug);
    await prisma.program.update({
      where: { id: p.id },
      data: { categoryId: cat.id },
    });
    migratedPrograms++;
  }

  // foto tanpa kategori (bila ada) → "Lainnya"
  const orphan = await prisma.galleryImage.count({ where: { categoryId: null } });
  if (orphan > 0) {
    const cat = await ensureCategory("Lainnya", "lainnya");
    await prisma.galleryImage.updateMany({
      where: { categoryId: null },
      data: { categoryId: cat.id },
    });
  }

  console.log(`Selesai:
  - kategori di DB : ${await prisma.category.count()}
  - program dimigrasi: ${migratedPrograms}
  - foto tanpa kategori: ${orphan}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
