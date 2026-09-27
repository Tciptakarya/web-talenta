import { put, del } from "@vercel/blob";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/** True kalau Vercel Blob sudah dikonfigurasi (BLOB_READ_WRITE_TOKEN terisi). */
export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * True kalau proses berjalan di hosting serverless yang filesystem-nya
 * hanya-baca / ephemeral (Vercel, Lambda, Netlify). Di sana mode lokal
 * SELALU gagal menulis -> wajib pakai Vercel Blob.
 */
export function isEphemeralFs(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
}

export type StorageFailCode =
  | "blob-not-configured"
  | "readonly-fs"
  | "no-permission"
  | "disk-full"
  | "unknown";

/** Error penyimpanan dengan kode penyebab — pesan aman untuk ditampilkan ke user. */
export class StorageUnavailableError extends Error {
  readonly code: StorageFailCode;
  constructor(code: StorageFailCode, cause?: unknown) {
    // Pesannya sudah aman untuk pengguna (tanpa path/stack/credential) supaya
    // juga benar bila err.message-nya dipakai Server Action (materi).
    super(describeStorageFailure(code));
    this.name = "StorageUnavailableError";
    this.code = code;
    if (cause) this.cause = cause;
  }
}

/** Pesan aman (tanpa path/stack/credential) sesuai jenis kegagalan. */
export function describeStorageFailure(code: StorageFailCode): string {
  switch (code) {
    case "blob-not-configured":
      return "Penyimpanan foto belum dikonfigurasi di server ini. Administrator perlu mengatur BLOB_READ_WRITE_TOKEN (Vercel Blob) di Environment Variables, lalu deploy ulang.";
    case "readonly-fs":
      return "Server tidak dapat menyimpan foto: penyimpanan lokal bersifat hanya-baca di hosting ini. Administrator perlu mengatur BLOB_READ_WRITE_TOKEN (Vercel Blob).";
    case "no-permission":
      return "Server tidak dapat menyimpan foto: folder upload tidak bisa ditulis. Administrator perlu memeriksa izin folder atau mengaktifkan Vercel Blob.";
    case "disk-full":
      return "Server tidak dapat menyimpan foto: penyimpanan sudah penuh. Administrator perlu memeriksa ruang disk atau mengaktifkan Vercel Blob.";
    default:
      return "Server gagal menyimpan foto. Coba lagi beberapa saat lagi.";
  }
}

/** Petakan error filesystem/Blob ke StorageFailCode. */
function classifyStorageError(err: unknown): StorageFailCode {
  const e = err as { code?: string; message?: string } | null;
  const code = (e?.code ?? "").toUpperCase();
  const msg = (e?.message ?? "").toLowerCase();
  if (code === "EROFS" || msg.includes("read-only")) return "readonly-fs";
  if (code === "EACCES" || code === "EPERM") return "no-permission";
  if (code === "ENOSPC" || code === "EDQUOT") return "disk-full";
  return "unknown";
}

function isBlobUrl(url: string): boolean {
  return url.includes(".blob.vercel-storage.com");
}

/**
 * Penjaga sebelum memproses file: kalau hosting tidak persisten dan Blob
 * belum dikonfigurasi, gagal cepat dengan pesan jelas — bukan enigmatic
 * "Upload gagal" setelah gambar selesai dikompres.
 */
export function assertStorageReady(): void {
  if (blobEnabled()) return;
  if (isEphemeralFs()) {
    throw new StorageUnavailableError("blob-not-configured");
  }
}

/**
 * Simpan file gambar. Prioritas: Vercel Blob (PRD §4).
 * Fallback tanpa token: public/uploads (mode lokal / dev).
 * Kegagalan storage dilempar sebagai StorageUnavailableError agar
 * pemanggil bisa menampilkan penyebab yang tepat.
 */
export async function storeImage(buffer: Buffer, filename: string): Promise<string> {
  if (blobEnabled()) {
    try {
      const blob = await put(filename, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: undefined,
      });
      return blob.url;
    } catch (err) {
      throw new StorageUnavailableError(classifyStorageError(err), err);
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    await writeFile(path.join(dir, safeName), buffer);
    return `/uploads/${safeName}`;
  } catch (err) {
    throw new StorageUnavailableError(classifyStorageError(err), err);
  }
}

/** Hapus file gambar dari storage tempat file itu disimpan. */
export async function removeImage(url: string): Promise<void> {
  try {
    if (blobEnabled() && isBlobUrl(url)) {
      await del(url);
      return;
    }
    if (url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
      await unlink(filePath);
    }
  } catch (err) {
    // Gagal hapus file tidak boleh menggagalkan operasi utama.
    console.error("[storage] gagal menghapus file:", err);
  }
}
