import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import {
  StorageUnavailableError,
  assertStorageReady,
  describeStorageFailure,
  storeImage,
} from "@/lib/storage";
import {
  BERITA_IMAGE_BYTES,
  BERITA_IMAGE_TYPES,
  parseVideoLink,
} from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * POST /api/upload/berita — unggah **satu** foto utama berita.
 *
 * Sengaja route TERPISAH dari `/api/upload` (galeri):
 * route galeri membuat baris `GalleryImage` dan mewajibkan kategori + tahun,
 * sedangkan berita cuma butuh URL file. Memakai satu route dengan parameter
 * `tipe` berarti foto berita bisa salah terimpan sebagai foto galeri — dan
 * route yang sudah berjalan tidak boleh diutak-atik.
 *
 * File TIDAK disimpan ke tabel apa pun: route ini hanya mengembalikan URL,
 * lalu Server Action `createBerita`/`updateBerita` yang menempelkannya ke
 * baris berita. Jadi mengunggah lalu membatalkan tidak meninggalkan data
 * sampah di database.
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

  // Terima berdasarkan MIME atau ekstensi (sebagian client mengirim octet-stream).
  const ext = (file.name ?? "").toLowerCase().split(".").pop() ?? "";
  const typeOk =
    BERITA_IMAGE_TYPES.includes(file.type as never) ||
    ["jpg", "jpeg", "png", "webp"].includes(ext);
  if (!typeOk) {
    return NextResponse.json(
      { ok: false, error: "Format foto harus JPG, PNG, atau WebP." },
      { status: 400 }
    );
  }

  if (file.size > BERITA_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Ukuran foto maksimal 8MB." },
      { status: 400 }
    );
  }

  // Penjaga storage: di Vercel, filesystem ephemeral + Blob kosong = pasti gagal.
  try {
    assertStorageReady();
  } catch (err) {
    const code = err instanceof StorageUnavailableError ? err.code : "unknown";
    return NextResponse.json({ ok: false, error: describeStorageFailure(code) }, { status: 503 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());

    const processed = await sharp(input)
      .rotate() // hormati EXIF orientation supaya foto HP tidak miring
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Suffix acak: dua upload berbarengan bisa berebut nama kalau hanya Date.now().
    const filename = `berita-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const url = await storeImage(processed, filename);

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[upload/berita] gagal:", err);
    if (err instanceof StorageUnavailableError) {
      return NextResponse.json(
        { ok: false, error: describeStorageFailure(err.code) },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          "Gagal memproses foto. Pastikan file JPG, PNG, atau WebP yang valid.",
      },
      { status: 422 }
    );
  }
}

/**
 * GET /api/upload/berita?konten=youtube&v=<url>
 *
 * Endpoint bantu untuk mengambil **thumbnail YouTube** dari link yang ditempel
 * admin, supaya kartu berita tetap punya gambar walau videonya dari YouTube.
 *
 * Server tidak pernah mengunduh apa pun dari URL tersebut — dia hanya
 * mengekstrak ID lewat `parseVideoLink()` lalu membangun sendiri URL
 * thumbnail dari ID itu. Jadi:
 * - admin tak bisa membuat server mengambil URL sembarang (tidak ada SSRF);
 * - browser yang mengunduh thumbnail-nya, dan itu URL `i.ytimg.com` yang
 *   dibangun server, bukan input mentah admin.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Tidak terautentikasi." }, { status: 401 });
  }

  const link = parseVideoLink(new URL(req.url).searchParams.get("v") ?? "");
  if (!link) {
    return NextResponse.json(
      {
        ok: false,
        error: "Link YouTube/Vimeo tidak dikenali. Tempel URL youtube.com/watch?v=... atau vimeo.com/...",
      },
      { status: 400 }
    );
  }

  // Vimeo tidak menyediakan thumbnail gratis tanpa API key, jadi hanya
  // YouTube yang dikembalikan.
  if (link.host !== "youtube") {
    return NextResponse.json(
      {
        ok: true,
        url: null,
        info: "Thumbnail otomatis hanya tersedia untuk YouTube. Vimeo perlu diunggah manual atau dibiarkan tanpa thumbnail.",
      }
    );
  }

  return NextResponse.json({
    ok: true,
    url: `https://i.ytimg.com/vi/${link.id}/hqdefault.jpg`,
  });
}
