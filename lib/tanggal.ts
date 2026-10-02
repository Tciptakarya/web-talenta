/**
 * Format tanggal bersama — **tanpa** `import "server-only"`, jadi boleh dipakai
 * di Server Component maupun Client Component.
 *
 * Dipisah dari `lib/data.ts` karena file itu menandai dirinya `server-only`
 * (semua query Prisma ada di sana). Client Component seperti
 * `components/site/BeritaCard.tsx` tetap butuh fungsi format tanggal, jadi
 * fungsi taruh di sini.
 *
 * `lib/data.ts` meng-`export` ulang semuanya, jadi import lama
 * `from "@/lib/data"` tetap bekerja tanpa perlu diubah.
 */

/** "Sep" -> "September". Dipakai juga oleh kalender tak-en. */
export const BULAN_PENUH = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const BULAN_PENDEK = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** "2026-09-30" -> "30 Sep 2026"; parsing manual agar tidak bergeser zona waktu. */
export function formatTanggalYmd(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${d} ${BULAN_PENDEK[(m ?? 1) - 1] ?? ""} ${y}`.trim();
}

/** Date -> "YYYY-MM-DD" di zona Asia/Jakarta (tanpa geser zona). */
export function ymdWib(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Tanggal berita -> "12 Oktober 2026" (bahasa Indonesia, zona Asia/Jakarta).
 *
 * Sengaja BUKAN `toLocaleDateString("id-ID")`:
 * - default `toLocaleDateString` memakai zona waktu server (Vercel = UTC), jadi
 *   tanggal bisa bergeser satu hari;
 * - dan hasil `Intl` bisa berbeda antar runtime (Node vs Edge).
 *
 * Dipakai `formatToParts` dengan `timeZone` eksplisit, jadi hasilnya stabil
 * dan tidak pernah bergeser.
 */
export function formatTanggalIndo(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")} ${BULAN_PENUH[Number(get("month")) - 1] ?? ""} ${get("year")}`.trim();
}
