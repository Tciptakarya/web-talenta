import Link from "next/link";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/themeScript";
import ThemeEnforcer from "@/components/site/ThemeEnforcer";
// CSS di-import ulang di sini dengan sengaja: pada jalur `notFound()` root
// layout tidak dirender, sehingga `<link rel="stylesheet">` tidak ikut di
// dokumen 404 dan baru disuntik React saat hidrasi (menyebabkan kedip
// tanpa gaya). Next.js men-dedup import CSS yang sama, jadi ini aman.
import "@/app/globals.css";

/**
 * Isi halaman 404 — dipakai dua kali:
 * - `app/(public)/not-found.tsx` → untuk URL yang **cocok route** tapi
 *   `notFound()` dipanggil (mis. `/berita/<slug>` yang tidak ada). Dirender
 *   DI DALAM `(public)/layout.tsx`, jadi sudah ada navbar + footer.
 * - `app/not-found.tsx` → untuk URL yang **tidak cocok route sama sekali**
 *   (mis. `/foo/bar`). Hanya punya root layout, jadi tanpa navbar/footer.
 *
 * **Kenapa tidak pakai 404 bawaan Next.js?**
 * Next menyuntik `<style>` sendiri ke halaman 404:
 *
 *   body{color:#000;background:#fff}
 *   @media (prefers-color-scheme:dark){body{color:#fff;background:#000}}
 *
 * Style itu **membypass seluruh design system** website dan memakai preto/
 * putih murni, mengikuti preferensi **sistem operasi** — bukan toggle dark mode
 * milik situs (`ThemeToggle` + kelas `dark` di `<html>`). Akibatnya user
 * light-mode dengan OS gelap melihat halaman 404 berlatar **hitam pekat**
 * (#000) yang sama sekali tidak cocok dengan header/footer di atasnya.
 * Terverifikasi lewat `getComputedStyle(document.body).backgroundColor`
 * → `rgb(0, 0, 0)`.
 *
 * Komponen ini **tidak** memakai `getContentMap()` / Prisma: halaman 404 harus
 * tetap bisa dirender walau database sedang tidak bisa dijangkau. Karena itu
 * teksnya ditulis di sini — sama seperti teks halaman `/kelas` yang juga
 * statis. Yang diedit admin tetap label menu navbar/footer lewat
 * `lib/siteContent.ts`.
 *
 * PENTING: pakai `<div>`, bukan `<header>`/`<footer>` — `app/globals.css` punya
 * rule global `header{position:fixed;top:0;z-index:100}` yang akan membuat
 * elemen tersebut lepas dari alur dan menumpuk di tepi atas layar.
 */
export default function NotFoundContent({
  /** true = tanpa navbar/footer (dipakai root `app/not-found.tsx`). */
  standalone = false,
}: {
  standalone?: boolean;
}) {
  return (
    <>
      {/* Wajib ada: root layout TIDAK dirender pada halaman 404, jadi tanpa
          skrip ini `localStorage.theme = "dark"` tidak pernah diterapkan.
          Lihat lib/themeScript.ts. */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />

      {/* Skrip di atas memasang class `dark` sebelum paint (anti-kedip), tapi
          hidrasi React kemudian menormalkan ulang `className` <html> dan
          menghapusnya. Komponen ini dipasang ulang SETELAH hidrasi. */}
      <ThemeEnforcer />

      <div
        className={`notfound${standalone ? " notfound-standalone" : ""}`}
        id="notfound"
      >
      <span className="kicker notfound-kicker">Halaman tidak ditemukan</span>

      {/* Angka 404 memakai Fraunces (font-display) supaya konsisten dengan
          judul-judul besar di site ini. */}
      <p className="notfound-angka" aria-hidden="true">
        404
      </p>

      <h1 className="notfound-judul">
        Halaman yang Anda cari tidak ada
      </h1>

      <p className="notfound-keterangan">
        Halamannya mungkin sudah dipindahkan, atau tautannya salah ketik.
        Coba kembali ke beranda atau lihat daftar program pelatihan kami.
      </p>

      <div className="notfound-aksi">
        <Link href="/" className="btn btn-primary">
          Kembali ke Beranda
        </Link>
        <Link href="/kelas" className="btn btn-ghost">
          Lihat Program Kelas
        </Link>
      </div>
      </div>
    </>
  );
}
