import { getContentMap } from "@/lib/siteContent";
import KontenEditor from "@/components/admin/KontenEditor";

export const dynamic = "force-dynamic";

/**
 * Admin > Tampilan Website — mengedit teks statis yang tampil di situs publik.
 *
 * Foto, program, jadwal, kategori, dan testimoni tetap punya menunya masing-masing
 * (Galeri, Program, Jadwal, Kategori, Testimoni). Halaman ini khusus untuk
 * teks marketing/penjelasan yang tidak ada entry-nya di database.
 */
export default async function AdminKontenPage() {
  const current = await getContentMap();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Tampilan Website</h1>
        <p className="mt-1 max-w-2xl text-sm text-mist">
          Ubah judul, paragraf, dan label yang tampil di website publik. Perubahan
          langsung berlaku di seluruh halaman publik setelah disimpan.
        </p>
        <p className="mt-2 max-w-2xl rounded-lg border border-line bg-white px-3 py-2 text-xs text-mist">
          <strong className="text-ink">Format:</strong> penanda <code>**tebal**</code>{" "}
          untuk menebalkan sebagian, <code>*miring*</code> untuk miring, dan baris baru
          untuk pemisah baris. HTML tidak diizinkan — teks selalu diamankan sebelum
          ditampilkan. Kolom yang dikosongkan kembali memakai nilai bawaan (teks
          website sekarang).
        </p>
      </div>

      <KontenEditor current={current} />
    </div>
  );
}
