/**
 * Skrip bootstrap tema — **satu-satunya sumber** untuk initialize light/dark
 * sebelum halaman digambar pertama kali (mencegah kedip light→dark).
 *
 * ## Kenapa file ini ada (masalah nyata, terverifikasi)
 *
 * Skrip ini awalnya hanya ada di `app/layout.tsx`. Tapi pada halaman 404 yang
 * dihasilkan `notFound()`, Next.js 15.5.25 **tidak merender root layout** —
 * dokumen yang dikirim adalah `<html id="__next_error__">` tanpa
 * `lang="id"`, tanpa kelas font, dan **tanpa `<link rel="stylesheet">`**
 * (CSS baru disuntik React saat hidrasi). Akibatnya:
 *
 * - `localStorage.theme = "dark"` tapi `<html>` tidak pernah dapat class
 *   `dark` → **dark mode mati total di halaman 404**;
 * - `lang="id"` hilang (aksesibilitas & SEO).
 *
 * Workaround resmi dari dokumentasi/community Next (route catch-all
 * `[...not-found]/page.tsx`) **tidak memperbaiki hal ini** di 15.5.25 — sudah
 * diuji dan root layout tetap tidak dirender; malah membuat URL yang tadinya
 * benar ikut rusak. Jadi solusinya: pasang skrip ini **juga** di halaman 404.
 *
 * Skrip ini sengaja dibuat idempotent dan aman dipanggil lebih dari sekali,
 * karena memang dipakai di dua tempat (`app/layout.tsx` + `not-found`).
 *
 * `document.title` sengaja TIDAK diatur di sini: metadata React yang
 * menentukan title (dari `metadata`/`generateMetadata`), dan penulisan dari
 * skrip akan ditimpa lagi saat hidrasi. Halaman 404 punya `metadata` sendiri.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{
  document.documentElement.lang="id";
  var t=null;try{t=localStorage.getItem("theme")}catch(e){}
  if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}
}catch(e){}})();`;
