// Seed data: kategori kelas, 11 program, testimoni, foto galeri, akun admin.
// Aman dijalankan berulang (upsert create-only / update: {}) — tidak
// menduplikasi data DAN tidak menimpa editan admin atau password yang
// sudah diganti (penting: script ini jalan di setiap build Hostinger).
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GALLERY_IMAGES, PROGRAMS, TESTIMONIALS } from "../lib/content";

const prisma = new PrismaClient();

/** Kategori default — bisa ditambah/diedit/dihapus dari Admin > Kategori Kelas. */
const CATEGORIES = [
  { name: "Barista", slug: "barista", description: "Suasana belajar dan berlatih di Kelas Barista" },
  { name: "Kelas Komputer", slug: "kelas-komputer", description: "Belajar, mencoba, dan berkarya bersama" },
  { name: "Tata Boga", slug: "tata-boga", description: "Program pelatihan Tata Boga — dari dasar hingga mahir" },
  { name: "Digital Marketing", slug: "digital-marketing", description: "Program pelatihan Digital Marketing" },
  { name: "Bimbingan Belajar", slug: "bimbingan-belajar", description: null },
  { name: "Pelatihan K3", slug: "pelatihan-k3", description: null },
  { name: "Keselamatan Maritim", slug: "keselamatan-maritim", description: null },
  { name: "Pelatihan Kendaraan Listrik", slug: "kendaraan-listrik", description: null },
];

/** slug program → slug kategori */
const PROGRAM_CATEGORY: Record<string, string> = {
  "pelatihan-barista": "barista",
  "kursus-komputer": "kelas-komputer",
  "pelatihan-tata-boga": "tata-boga",
  "digital-marketing": "digital-marketing",
  "bimbingan-belajar": "bimbingan-belajar",
  "pelatihan-k3": "pelatihan-k3",
  bosiet: "keselamatan-maritim",
  "basic-safety-training": "keselamatan-maritim",
  "basic-sea-survival": "keselamatan-maritim",
  "basic-fire-first-aid": "keselamatan-maritim",
  "pelatihan-kendaraan-listrik": "kendaraan-listrik",
};

async function main() {
  // 1. Kategori (idempoten)
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {}, // create-only — nama hasil edit admin tidak boleh tertimpa
      create: { ...c, isActive: true },
    });
  }

  // 2. Program — 11 program (PRD §10), terhubung ke kategori
  for (const [i, p] of PROGRAMS.entries()) {
    const catSlug = PROGRAM_CATEGORY[p.slug];
    const category = catSlug
      ? await prisma.category.findUnique({ where: { slug: catSlug } })
      : null;
    const { categorySlug, ...programData } = p;
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: {}, // create-only — editan admin tidak boleh tertimpa saat build ulang
      create: {
        ...programData,
        urutan: i + 1,
        categoryId: category?.id ?? null,
      },
    });
  }

  // 3. Testimoni — hanya saat kosong, agar editan admin tidak tertimpa
  if ((await prisma.testimonial.count()) === 0) {
    for (const [i, t] of TESTIMONIALS.entries()) {
      await prisma.testimonial.create({ data: { ...t, urutan: i + 1 } });
    }
  }

  // 4. Galeri — 12 foto v1 (6 Barista + 6 Komputer), hanya saat kosong
  if ((await prisma.galleryImage.count()) === 0) {
    for (const [i, g] of GALLERY_IMAGES.entries()) {
      const category = await prisma.category.findUnique({
        where: { slug: g.kategoriSlug },
      });
      await prisma.galleryImage.create({
        data: {
          url: g.url,
          caption: g.caption,
          alt: g.alt,
          urutan: i + 1,
          categoryId: category?.id ?? null,
        },
      });
    }
  }

  // 5. Akun admin — 1 akun (PRD §5), password di-hash bcrypt
  const email = process.env.ADMIN_EMAIL || "admin@talentaciptakarya.com";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: {}, // create-only — password TIDAK direset oleh build/deploy ulang
    create: { email, passwordHash },
  });

  console.log(`Seed selesai:
  - ${await prisma.category.count()} kategori
  - ${await prisma.program.count()} program
  - ${await prisma.testimonial.count()} testimoni
  - ${await prisma.galleryImage.count()} foto galeri
  - admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
