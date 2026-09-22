import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeImage } from "@/lib/storage";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  uploadSchema,
} from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * POST /api/upload — upload foto galeri dari dashboard admin (PRD §6).
 * Kompres/resize otomatis via sharp (§8) → simpan ke Blob (atau /uploads
 * lokal) → simpan metadata ke GalleryImage → langsung tampil di galeri.
 * Kategori sekarang relasi Category (categoryId), bukan string bebas.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Form tidak valid." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "File foto wajib dipilih." },
      { status: 400 }
    );
  }

  // Terima berdasarkan MIME atau ekstensi (beberapa client mengirim octet-stream)
  const ext = (file.name ?? "").toLowerCase().split(".").pop() ?? "";
  const typeOk =
    ALLOWED_IMAGE_TYPES.includes(file.type as never) ||
    ["jpg", "jpeg", "png", "webp", "avif"].includes(ext);
  if (!typeOk) {
    return NextResponse.json(
      { ok: false, error: "Format gambar harus JPG, PNG, WebP, atau AVIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Ukuran foto maksimal 8MB." },
      { status: 400 }
    );
  }

  const meta = uploadSchema.safeParse({
    categoryId: form.get("categoryId"),
    caption: form.get("caption") ?? "",
    alt: form.get("alt") ?? "",
  });
  if (!meta.success) {
    return NextResponse.json(
      { ok: false, error: meta.error.issues[0]?.message ?? "Data tidak valid." },
      { status: 400 }
    );
  }

  // Pastikan kategori ada
  const category = await prisma.category.findUnique({
    where: { id: meta.data.categoryId },
  });
  if (!category) {
    return NextResponse.json(
      { ok: false, error: "Kategori tidak ditemukan." },
      { status: 400 }
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());

    // Resize + kompres otomatis (PRD §8: jangan ulangi masalah index.html 2.1MB)
    const processed = await sharp(input)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const filename = `galeri-${Date.now()}.webp`;
    const url = await storeImage(processed, filename);

    const created = await prisma.galleryImage.create({
      data: {
        url,
        categoryId: meta.data.categoryId,
        caption: meta.data.caption,
        alt: meta.data.alt || null,
        urutan: (await prisma.galleryImage.count()) + 1,
      },
    });

    return NextResponse.json({ ok: true, image: created });
  } catch (err) {
    console.error("[upload] gagal:", err);
    return NextResponse.json(
      { ok: false, error: "Upload gagal. Coba lagi dengan foto lain." },
      { status: 500 }
    );
  }
}
