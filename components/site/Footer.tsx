import Image from "next/image";
import Rich from "@/components/site/Rich";
import { textOf, withYear, type ContentMap } from "@/lib/siteContent";

// Anchor memakai path absolut (/#about) supaya berfungsi juga dari
// halaman di luar beranda (mis. /kelas).
// Urutan & href harus PERSIS sama dengan `NAV_LINKS` di `Header.tsx` —
// urutannya mengikuti urutan section di beranda. Kalau ada section yang
// dipindah, pindahkan juga di kedua file ini.
const NAV_LINKS = [
  { href: "/#berita", key: "nav.berita" },
  { href: "/#about", key: "nav.about" },
  { href: "/#visimisi", key: "nav.visimisi" },
  { href: "/#layanan", key: "nav.layanan" },
  { href: "/#jadwal-terdekat", key: "nav.jadwal" },
  { href: "/#galeri", key: "nav.galeri" },
  { href: "/#lokasi", key: "nav.lokasi" },
  { href: "/#testimoni", key: "nav.testimoni" },
];

export default function Footer({ c }: { c: ContentMap }) {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            {/* Footer selalu latar navy (#0F1836) di kedua mode → pakai
                varian logo berteks putih. */}
            <Image
              src="/logo-inverse.png"
              alt="Talenta Cipta Karya"
              width={805}
              height={800}
            />
          </div>
          <nav className="footer-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                <Rich text={textOf(c, l.key)} />
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <div className="footer-info">
            <span>
              <Rich text={withYear(textOf(c, "footer.copyright"))} />
            </span>
            <a href="mailto:info@talentaciptakarya.com">
              info@talentaciptakarya.com
            </a>
          </div>
          <div className="social-row">
            <a
              href="https://www.instagram.com/tciptakarya"
              target="_blank"
              rel="noopener"
              className="social-btn"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
            </a>
            <a
              href="mailto:info@talentaciptakarya.com"
              className="social-btn"
              aria-label="Email info@talentaciptakarya.com"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
            <a
              href="https://wa.me/628119700322?text=Halo%20Talenta%20Cipta%20Karya%2C%20saya%20ingin%20bertanya%20tentang%20program%20pelatihan."
              target="_blank"
              rel="noopener"
              className="social-btn"
              aria-label="WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1" />
                <path d="M21 11.5c0 4.7-3.8 8.5-8.5 8.5a8.6 8.6 0 0 1-4.3-1.1L3 20l1.2-5A8.5 8.5 0 0 1 21 11.5z" />
                <path d="M9 10.3c0 2.6 2.1 4.7 4.7 4.7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
