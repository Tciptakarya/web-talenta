"use client";

/**
 * Tombol ganti tema terang/gelap.
 * Men-toggle class "dark" di <html> dan menyimpan pilihan ke
 * localStorage("theme") — skrip inline di app/layout.tsx membacanya
 * sebelum paint supaya tema langsung konsisten (tanpa kedip).
 * Ikon diganti lewat CSS (bukan state) supaya tidak ada mismatch hydration.
 */
export default function ThemeToggle() {
  function toggle() {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage bisa saja diblokir — abaikan */
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Ganti mode gelap / mode terang"
      title="Ganti mode gelap / mode terang"
    >
      {/* bulan = sedang mode terang, klik untuk ke gelap */}
      <svg
        className="theme-icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* matahari = sedang mode gelap, klik untuk ke terang */}
      <svg
        className="theme-icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
