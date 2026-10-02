"use client";

import { useEffect } from "react";

/**
 * Pastikan tema & `lang` tetap benar **setelah** hidrasi React selesai.
 *
 * ## Kenapa perlu (bug nyata, terverifikasi 2026-10-02)
 *
 * Halaman 404 yang dihasilkan `notFound()` tidak dirender bersama root layout
 * `app/layout.tsx`. Dokumen yang dikirim Next adalah
 * `<html id="__next_error__">` — tanpa `suppressHydrationWarning`.
 *
 * Akibatnya:
 * 1. Skrip anti-FOUC di `app/layout.tsx` tidak ikut, jadi tanpa bootstrap
 *    tambahan, `localStorage.theme = "dark"` tidak pernah diterapkan.
 * 2. Bahkan kalau bootstrap-nya dipasang di komponen 404, **hidrasi React
 *    menormalkan ulang `className` `<html>`** ke nilai server (kosong) dan
 *    menghapus class `dark` yang baru saja ditambahkan skrip.
 *
 * `useEffect` ini berjalan **setelah** hidrasi, jadi class `dark` yang ia
 * pasang menang atas penulisan ulang React.
 *
 * Idempotent: aman di halaman yang root layout-nya sudah menangani tema
 * (halaman normal), karena hasilnya sama persis.
 */
export default function ThemeEnforcer() {
  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      const gelap =
        t === "dark" ||
        (t !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", gelap);
      // Shell error Next tidak menyertakan lang; pastikan tetap "id".
      if (!document.documentElement.lang) document.documentElement.lang = "id";
    } catch {
      /* localStorage diblokir — abaikan, tema tetap default */
    }
  }, []);

  return null;
}
