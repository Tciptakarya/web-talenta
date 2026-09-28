"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/site/ThemeToggle";
import Rich from "@/components/site/Rich";
import { textOf, type ContentMap } from "@/lib/siteContent";

// Anchor memakai path absolut (/#about) supaya tetap berfungsi dari
// halaman lain di luar beranda (mis. dari /kelas).
// `key` = key di registry Tampilan Website; label diambil dari sana.
const NAV_LINKS = [
  { href: "/#about", key: "nav.about" },
  { href: "/#visimisi", key: "nav.visimisi" },
  { href: "/#layanan", key: "nav.layanan" },
  { href: "/#galeri", key: "nav.galeri" },
  { href: "/#lokasi", key: "nav.lokasi" },
  { href: "/#testimoni", key: "nav.testimoni" },
];

/** Header v1: state scroll, menu mobile, tombol close di dalam nav. */
export default function Header({ c }: { c: ContentMap }) {
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
          {/* Dua varian logo: teks gelap (latar terang) & teks putih
              (latar gelap). Ditukar lewat CSS di globals.css — jangan
              pakai satu gambar untuk dua latar, teksnya jadi tak
              terbaca. */}
          <Image
            src="/logo.png"
            alt="Talenta Cipta Karya"
            width={805}
            height={800}
            className="logo-on-light"
            priority
          />
          <Image
            src="/logo-inverse.png"
            alt=""
            width={805}
            height={800}
            className="logo-on-dark"
            loading="lazy"
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
              <Rich text={textOf(c, l.key)} />
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <ThemeToggle />
          <a href="/#kontak" className="btn btn-ghost">
            <Rich text={textOf(c, "nav.kontak")} />
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
