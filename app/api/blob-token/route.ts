import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import { BERITA_VIDEO_BYTES, BERITA_VIDEO_TYPES } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * POST /api/blob-token — tukar token upload untuk **video berita**.
 *
 * **Kenapa route ini ada (masalah nyata, bukan gaya):**
 * Vercel Functions punya batas keras **4,5 MB per request** untuk Route Handler
 * *dan* Server Action. Batasnya di level infrastruktur, jadi tidak bisa
 * dinaikkan lewat konfigurasi apa pun. Video hampir selalu lebih besar dari
 * 4,5 MB — jadi kalau video dikirim lewat server, hasilnya 413 dan gagal.
 *
 * Solusinya pola *client-direct upload*: browser mengirim file **langsung**
 * ke Vercel Blob, sedangkan server hanya menukar token berumur singkat. File
 * tidak pernah melewati function, jadi batas 4,5 MB tidak relevan — tapi
 * autentikasi tetap terjadi di server lewat `onBeforeGenerateToken`, jadi
 * anonymous tetap tidak bisa mengunggah.
 *
 * Yang DITOLAK di sini: tanpa sesi admin tidak dapat token sama sekali, dan
 * tipe/ukuran video dibatasi oleh `allowedContentTypes` + validasi manual.
 *
 * Catatan: `onUploadCompleted` tidak jalan di localhost (Vercel tidak bisa
 * menghubungi `localhost`), jadi proses upload di server baru dipicu saat
 * form berita disimpan. URL yang dikembalikan browser dipakai Server Action
 * `createBerita`/`updateBerita`.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // WAJIB: autentikasi sebelum memberi token. Tanpa baris ini, siapa pun
        // bisa mengunggah file ke store Anda.
        if (!session) throw new Error("Tidak terautentikasi.");

        // Hanya ekstensi video yang diizinkan. Nama file dari client tidak
        // dipercaya untuk tipe, tapi tetap dipakai untuk penyaringan awal.
        const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
        const extOk = ["mp4", "webm"].includes(ext);
        if (!extOk) {
          throw new Error("Format video harus MP4 atau WebM.");
        }

        return {
          allowedContentTypes: BERITA_VIDEO_TYPES,
          maximumSizeInBytes: BERITA_VIDEO_BYTES,
          addRandomSuffix: true,
          // Dikembalikan ke browser setelah upload selesai; tidak dipakai
          // untuk otorisasi apa pun.
          tokenPayload: JSON.stringify({ oleh: "admin" }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Sengaja tidak menulis ke database di sini: berita belum tentu
        // disimpan admin (mungkin dibatalkan), jadi menulis baris berita dari
        // callback akan menghasilkan data orphan. URL-nya diambil browser
        // lalu disimpan lewat Server Action.
        console.log("[blob-token] video berita terunggah:", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menyiapkan upload video.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
