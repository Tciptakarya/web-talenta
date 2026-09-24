"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/site/ThemeToggle";

// Anchor memakai path absolut (/#about) supaya tetap berfungsi dari
// halaman lain di luar beranda (mis. dari /kelas).
const NAV_LINKS = [
  { href: "/#about", label: "Tentang Kami" },
  { href: "/#visimisi", label: "Visi & Misi" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#galeri-lainnya", label: "Galeri" },
  { href: "/#lokasi", label: "Lokasi" },
  { href: "/#testimoni", label: "Testimoni" },
];

/** Header v1: state scroll, menu mobile, tombol close di dalam nav. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header id="siteHeader" className={scrolled ? "is-scrolled" : undefined}>
      <div className="wrap">
        <a href="/#top" className="brand">
          <Image
            src="/logo.png"
            alt="Talenta Cipta Karya"
            width={449}
            height={437}
            priority
          />
        </a>
        <nav className={`main-nav${open ? " open" : ""}`} id="mainNav">
          <button
            type="button"
            className="mobile-nav-close"
            aria-label="Tutup menu"
            onClick={close}
          >
            &times;
          </button>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link" onClick={close}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <ThemeToggle />
          <a href="/#kontak" className="btn btn-ghost">
            Hubungi Kami
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
