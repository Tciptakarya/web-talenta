import type { SisaKursi } from "@/lib/data";

/**
 * Badge sisa kursi pada tabel jadwal publik (server component tanpa state).
 * Hijau "Tersedia" · kuning "Sisa N kursi" · merah "Penuh".
 * Warna mengikuti konvensi badge di JadwalTerdekat (mendukung dark mode).
 */
export default function KuotaBadge({ kursi }: { kursi: SisaKursi }) {
  const cls = kursi.penuh
    ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/30"
    : kursi.terbatas
      ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30"
      : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30";

  const label = kursi.penuh
    ? "Penuh"
    : kursi.terbatas
      ? `Sisa ${kursi.sisa} kursi`
      : "Tersedia";

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${cls}`}
    >
      {label}
    </span>
  );
}
