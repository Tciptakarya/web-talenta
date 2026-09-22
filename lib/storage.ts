import { put, del } from "@vercel/blob";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/** True kalau Vercel Blob sudah dikonfigurasi (BLOB_READ_WRITE_TOKEN terisi). */
export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isBlobUrl(url: string): boolean {
  return url.includes(".blob.vercel-storage.com");
}

/**
 * Simpan file gambar. Prioritas: Vercel Blob (PRD §4).
 * Fallback tanpa token: public/uploads (mode lokal / dev).
 */
export async function storeImage(buffer: Buffer, filename: string): Promise<string> {
  if (blobEnabled()) {
    const blob = await put(filename, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: undefined,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  await writeFile(path.join(dir, safeName), buffer);
  return `/uploads/${safeName}`;
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
