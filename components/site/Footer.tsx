import Image from "next/image";

// Anchor memakai path absolut (/#about) supaya berfungsi juga dari
// halaman di luar beranda (mis. /kelas).
const NAV_LINKS = [
  { href: "/#about", label: "Tentang Kami" },
  { href: "/#visimisi", label: "Visi & Misi" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#galeri", label: "Galeri" },
  { href: "/#lokasi", label: "Lokasi" },
  { href: "/#testimoni", label: "Testimoni" },
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/logo.png"
              alt="Talenta Cipta Karya"
              width={449}
              height={437}
            />
          </div>
          <nav className="footer-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <div className="footer-info">
            <span>
              &copy; {new Date().getFullYear()} Talenta Cipta Karya. Semua hak
              dilindungi.
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
