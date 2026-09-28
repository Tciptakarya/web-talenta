"use client";

import { useEffect } from "react";

/**
 * Membersihkan fragment (#visimisi, #galeri, dst) dari address bar **setelah**
 * anchor diklik, tanpa mematikan perilaku native browser.
 *
 * Keputusan user 2026-09-28: address bar tetap bersih
 * (`https://talentaciptakarya.com`), sementara navigasi anchor tetap
 * berfungsi penuh — smooth scroll, `scroll-margin-top`, deep-link
 * (`/#visimisi` masih bisa dibuka/share), Ctrl+click buka tab baru, dan
 * navigasi keyboard.
 *
 * Cara kerja: link dibiarkan apa adanya (`<a href="#id">`), sehingga
 * browser melakukan scroll seperti biasa; lalu `history.replaceState`
 * mengganti URL tanpa fragment. `replaceState` dipakai (bukan
 * `pushState`) supaya tidak menambah riwayat — tombol Back tidak
 * terisi url hash yang tidak pernah berarti apa-apa.
 *
 * Yang SENGAJA tidak disentuh:
 * - link ke section di halaman lain (`/kelas/foo#jadwal`) — hash di sana
 *   berarti dan tidak dihapus;
 * - klik dengan modifier (Ctrl/Cmd/Shift/Alt, klik tengah) — itu
 *   membuka tab baru dan harus tetap membawa URL lengkap;
 * - hash yang diketik manual / dibuka dari luar — itu deep-link yang
 *   sengaja dipertahankan.
 */
export default function AnchorHashCleaner() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Hanya klik kiri biasa; modifier = buka di tab baru/jendela lain.
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      // Hanya link yang punya fragment: "#id" atau "/#id".
      if (!href.includes("#")) return;

      // Buang query/fragment untuk membandingkan pathname.
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      // Tunggu browser menyelesaikan navigasi fragment-nya, lalu bersihkan.
      window.setTimeout(() => {
        if (!window.location.hash) return;
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }, 150);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
