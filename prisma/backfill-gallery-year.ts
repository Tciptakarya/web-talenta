import { PrismaClient } from "@prisma/client";

/**
 * Backfill GalleryImage.year dari caption — IDEMPOTEN & AMAN.
 *
 * Hanya mengisi baris yang `year IS NULL` dan TAHUNYA TERTULIS jelas di
 * caption. Tidak ada tebakan: `uploadedAt` sengaja TIDAK dipakai karena
 * terbukti salah (semua foto diunggah 2026, tapi banyak foto kegiatan
 * 2022-2025). Foto tanpa sinyal tahun dibiarkan NULL → grup "Tanpa Tahun".
 *
 * Pola yang diakui:
 *   "2026: Wisuda Peserta ..."        → prefix "YYYY:"
 *   "... Batch #1 Tahun 2026"         → "Tahun YYYY"
 *
 * Jalankan: npx tsx prisma/backfill-gallery-year.ts
 */
const prisma = new PrismaClient();

const TAHUN_MIN = 1990;
const TAHUN_MAKS = new Date().getFullYear() + 1;

function valid(y: number | null): number | null {
  return y !== null && y >= TAHUN_MIN && y <= TAHUN_MAKS ? y : null;
}

function tahunDariCaption(caption: string): number | null {
  const prefix = caption.match(/^\s*(\d{4})\s*[:\-–]/);
  if (prefix) return valid(Number(prefix[1]));
  const kataTahun = caption.match(/\btahun\s+(\d{4})\b/i);
  if (kataTahun) return valid(Number(kataTahun[1]));
  return null;
}

async function main() {
  const kosong = await prisma.galleryImage.findMany({
    where: { year: null },
    select: { id: true, caption: true },
    orderBy: { urutan: "asc" },
  });

  let terisi = 0;
  const dilewati: number[] = [];

  for (const foto of kosong) {
    const tahun = tahunDariCaption(foto.caption);
    if (tahun === null) {
      dilewati.push(foto.id);
      continue;
    }
    await prisma.galleryImage.update({
      where: { id: foto.id },
      data: { year: tahun },
    });
    terisi += 1;
    console.log(`  #${foto.id} → ${tahun}  |  ${foto.caption.slice(0, 60)}`);
  }

  const [total, tanpaTahun, distinct] = await Promise.all([
    prisma.galleryImage.count(),
    prisma.galleryImage.count({ where: { year: null } }),
    prisma.galleryImage.findMany({
      where: { year: { not: null } },
      distinct: ["year"],
      select: { year: true },
    }),
  ]);

  console.log(`\nDiisi     : ${terisi} foto`);
  console.log(`Dilewati  : ${dilewati.length} foto (tanpa sinyal tahun di caption) — id: ${dilewati.join(", ") || "-"}`);
  console.log(`Total     : ${total} foto | tanpa tahun: ${tanpaTahun}`);
  console.log(`Tahun DB  : ${distinct.map((d) => d.year).sort((a, b) => (b ?? 0) - (a ?? 0)).join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
