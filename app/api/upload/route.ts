import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  StorageUnavailableError,
  assertStorageReady,
  describeStorageFailure,
  removeImage,
  storeImage,
} from "@/lib/storage";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  gallerySchema,
} from "@/lib/schemas";

export const runtime = "nodejs";

/** Error Prisma dikenali dari kode "P...." (P2002, P2025, dst). */
function isPrismaError(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  return typeof code === "string" && code.startsWith("P");
}

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

  // Penjaga storage: di hosting dengan filesystem ephemeral (Vercel) dan
  // Blob belum dikonfigurasi, menulis ke public/uploads pasti gagal —
  // gagal cepat dengan penyebab yang jelas, jangan enigmatic "Upload gagal".
  try {
    assertStorageReady();
  } catch (err) {
    const code =
      err instanceof StorageUnavailableError ? err.code : "unknown";
    console.error(
      `[upload] penyimpanan tidak siap (${code}): BLOB_READ_WRITE_TOKEN=${
        process.env.BLOB_READ_WRITE_TOKEN ? "terisi" : "KOSONG"
      }, hosting ephemeral=${Boolean(process.env.VERCEL)}`
    );
    return NextResponse.json(
      { ok: false, error: describeStorageFailure(code) },
      { status: 503 }
    );
  }

  const meta = gallerySchema.safeParse({
    categoryId: form.get("categoryId"),
    programId: form.get("programId") ?? "",
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

  // Program opsional — bila diisi, wajib bagian dari kategori yang dipilih.
  const programIdValue =
    typeof meta.data.programId === "number" ? meta.data.programId : null;
  if (programIdValue !== null) {
    const program = await prisma.program.findUnique({
      where: { id: programIdValue },
      select: { categoryId: true, judul: true },
    });
    if (!program) {
      return NextResponse.json(
        { ok: false, error: "Program tidak ditemukan." },
        { status: 400 }
      );
    }
    if (program.categoryId !== meta.data.categoryId) {
      return NextResponse.json(
        {
          ok: false,
          error: `Program "${program.judul}" bukan bagian dari kategori ${category.name}.`,
        },
        { status: 400 }
      );
    }
  }

  let url: string | null = null;
  try {
    const input = Buffer.from(await file.arrayBuffer());

    // Resize + kompres otomatis (PRD §8: jangan ulangi masalah index.html 2.1MB)
    const processed = await sharp(input)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Suffix acak: beberapa file bisa diunggah bersamaan (multi-upload) sehingga
    // Date.now() saja bisa bertabrakan di mode penyimpanan lokal.
    const filename = `galeri-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.webp`;
    url = await storeImage(processed, filename);

    // Urutan = tertinggi + 1 (bukan count()+1 yang bisa duplikat setelah hapus).
    const tertinggi = await prisma.galleryImage.aggregate({
      _max: { urutan: true },
    });

    const created = await prisma.galleryImage.create({
      data: {
        url,
        categoryId: meta.data.categoryId,
        programId: programIdValue,
        caption: meta.data.caption,
        alt: meta.data.alt || null,
        urutan: (tertinggi._max.urutan ?? 0) + 1,
      },
    });

    return NextResponse.json({ ok: true, image: created });
  } catch (err) {
    console.error("[upload] gagal:", err);
    // Jangan tinggalkan file yatim di storage bila penyimpanan metadata gagal.
    if (url) await removeImage(url);

    // Penyebab storage → pesan spesifik (503) + tetap log penuh di server.
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json(
        { ok: false, error: describeStorageFailure(err.code) },
        { status: 503 }
      );
    }

    // Database: file sudah diproses, metadata yang gagal.
    if (isPrismaError(err)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Foto berhasil diproses tetapi gagal disimpan ke database. Silakan coba lagi.",
        },
        { status: 500 }
      );
    }

    // Sisanya: pemrosesan gambar (sharp) atau hal lain yang tak terduga.
    return NextResponse.json(
      {
        ok: false,
        error:
          "Gagal memproses gambar. Pastikan file JPG, PNG, WebP, atau AVIF yang valid.",
      },
      { status: 422 }
    );
  }
}
