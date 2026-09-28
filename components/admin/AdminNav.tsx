"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Menu admin — **sumber tunggal** untuk sidebar (desktop) & nav mobile,
 * sekaligus tempatnya active state. Dipakai oleh
 * `app/admin/(dashboard)/layout.tsx` (server component) sebagai
 * `AdminNav`; layout hanya mengirim angka counter.
 *
 * Active state:
 * - Aktif dideteksi dari `usePathname()` (App Router) — bukan membuat
 *   sistem routing baru.
 * - `/admin` aktif HANYA saat persis di `/admin`; menu lain aktif juga
 *   untuk child route-nya (mis. `/admin/galeri` → `/admin/galeri/edit/123`).
 * - Pilih item **paling spesifik** yang cocok, jadi tidak pernah ada dua
 *   menu aktif bersamaan.
 * - `aria-current="page"` + gaya `.admin-nav-link.is-active` di
 *   `app/globals.css` (satu pola untuk semua halaman, tanpa copy-paste).
 *
 * Counter (angka galeri, badge pesan/pendaftaran) TIDAK diubah —
 * dipakai ulang persis seperti sebelumnya; hanya warnanya yang ikut
 * dinaikkan kontrasnya saat menu aktif.
 */
const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/program", label: "Program" },
  { href: "/admin/jadwal", label: "Jadwal Pelatihan" },
  { href: "/admin/pendaftaran", label: "Pendaftaran" },
  { href: "/admin/materi", label: "Materi Pelatihan" },
  { href: "/admin/kategori", label: "Kategori Kelas" },
  { href: "/admin/pesan", label: "Pesan Masuk" },
];

export default function AdminNav({
  variant = "sidebar",
  pesanCount = 0,
  fotoCount = 0,
  pendaftaranBaru = 0,
  unreadEmail = 0,
}: {
  variant?: "sidebar" | "mobile";
  pesanCount?: number;
  fotoCount?: number;
  pendaftaranBaru?: number;
  unreadEmail?: number;
}) {
  const pathname = usePathname() ?? "";
  // Normalisasi: buang garis miring di akhir supaya "/admin/" tetap mengenali
  // menu Dashboard.
  const path = pathname.replace(/\/+$/, "") || "/";

  // Item aktif = kecocokan path, item terpanjang (paling spesifik) menang.
  const activeHref = NAV.map((n) => n.href)
    .filter((href) =>
      href === "/admin" ? path === href : path === href || path.startsWith(`${href}/`)
    )
    .sort((a, b) => b.length - a.length)[0];

  const isActive = (href: string) => href === activeHref;
  const cls = (href: string) =>
    `admin-nav-link${isActive(href) ? " is-active" : ""}`;

  return (
    <nav
      aria-label="Menu admin"
      className={
        variant === "sidebar"
          ? "admin-nav md:flex-1 md:min-h-0 md:overflow-y-auto flex flex-col gap-1 pr-1 -mr-1"
          : "admin-nav admin-nav--mobile flex items-center gap-1"
      }
    >
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className={cls(n.href)}
          aria-current={isActive(n.href) ? "page" : undefined}
        >
          <span className="admin-nav-label">{n.label}</span>
          {n.href === "/admin/email" && unreadEmail > 0 && (
            <span className="admin-nav-badge ml-2 inline-block rounded-full bg-gold text-navy text-xs font-bold px-2 py-0.5">
              {unreadEmail}
            </span>
          )}
          {n.href === "/admin/pesan" && pesanCount > 0 && (
            <span className="admin-nav-badge ml-2 inline-block rounded-full bg-gold text-navy text-xs font-bold px-2 py-0.5">
              {pesanCount}
            </span>
          )}
          {n.href === "/admin/galeri" && (
            <span className="admin-nav-count ml-2 text-xs">{fotoCount}</span>
          )}
          {n.href === "/admin/pendaftaran" && pendaftaranBaru > 0 && (
            <span className="admin-nav-badge ml-2 inline-block rounded-full bg-gold text-navy text-xs font-bold px-2 py-0.5">
              {pendaftaranBaru}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
