import { renderInline } from "@/lib/siteContent";

/**
 * Render isi berita — **teks polos**, bukan HTML.
 *
 * Aturan parsing (sengaja dibuat sesederhana mungkin supaya tidak bisa rusak):
 * - Baris kosong memisahkan paragraf → tiap blok jadi satu `<p>`.
 * - `**tebal**` → `<strong>`, `*miring*` → `<em>`.
 * - Di dalam satu blok, baris baru jadi `<br />` — jadi penulis yang menulis
 *   baris demi baris tetap terlihat maksudnya.
 *
 * Keamanan: `renderInline()` (dari `lib/siteContent.ts`) melakukan escape HTML
 * **dahulu**, baru menyisipkan tag. Jadi admin tidak bisa menyuntikkan
 * `<script>` atau `onerror=` — apa pun yang diketik muncul sebagai teks biasa.
 * Ini jalur render yang sama dengan teks Tampilan Website, yang sudah pernah
 * diuji (XSS `<script>` → 0 elemen script di DOM).
 */
function toLines(isi: string): string[][] {
  // Normalisasi dulu: \r\n dan \r jadi \n, baru dipecah per baris kosong.
  return isi
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) => block.split("\n"));
}

export default function BeritaBody({ isi }: { isi: string }) {
  const blocks = toLines(isi);
  if (blocks.length === 0) return null;

  return (
    <div className="berita-isi">
      {blocks.map((lines, i) => (
        <p key={i}>
          {lines.map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {/* Setiap baris di-escape oleh renderInline — bukan HTML mentah. */}
              <span dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
