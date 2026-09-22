import Reveal from "@/components/site/Reveal";

/** Hero v1 — konten statis (brand), tanpa reveal (terlihat langsung). */
export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <div className="hero-eyebrow-row">
            <span className="badge-pill">
              <span className="dot" />LPK &amp; LKP Berizin Resmi
            </span>
          </div>
          <h1>
            Temukan Talenta,
            <br />
            Ciptakan <em>Karya.</em>
          </h1>
          <p className="lead">
            Yayasan Talenta Cipta Karya membekali kamu dengan keterampilan nyata
            lewat program pelatihan yang relevan dengan kebutuhan industri — dari
            nol hingga siap kerja.
          </p>
          <div className="hero-actions">
            <a href="#layanan" className="btn btn-primary">
              Lihat Layanan
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#kontak" className="btn btn-ghost">
              Hubungi Kami
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>LPK &amp; LKP</strong>
              <span>Terdaftar &amp; berizin resmi</span>
            </div>
            <div>
              <strong>Barista · Komputer</strong>
              <span>Bimbel · Digital Marketing</span>
            </div>
            <div>
              <strong>Depok, Jawa Barat</strong>
              <span>Lokasi pelatihan</span>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <svg
            className="ink-svg"
            viewBox="0 0 640 440"
            preserveAspectRatio="none"
          >
            <path
              className="ink-path soft"
              d="M10,120 C160,60 220,220 340,190 C440,165 480,280 610,230"
            />
            <path
              className="ink-path"
              d="M20,300 C160,260 210,120 340,150 C440,175 470,300 600,255"
            />
          </svg>
          <svg
            className="feather-rider"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.5 3.5c-4 0-9 2-11.5 7.5C6.5 15.5 5 19 3 21c3-1 6-1.5 9-3 5-2.5 8.5-7 8.5-14.5z" />
            <line x1="9" y1="14.5" x2="4" y2="19.5" />
          </svg>
          <div className="hero-card">
            <strong>Kurikulum Berbasis Industri</strong>
            <span>Program dirancang bersama mitra dunia usaha</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const check = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  return (
    <section className="section section-alt" id="about">
      <div className="wrap">
        <div className="about-grid">
          <Reveal>
            <span className="kicker">Tentang Kami</span>
            <h2
              style={{
                marginTop: 14,
                fontSize: "clamp(28px,3.2vw,38px)",
              }}
            >
              Ruang belajar untuk siapa pun yang siap berkarya
            </h2>
          </Reveal>
          <Reveal className="about-copy">
            <p>
              Selamat datang di <strong>Yayasan Talenta Cipta Karya</strong>,
              tempat kamu mendapatkan pembelajaran berkualitas yang membuka
              peluang karier. Kami adalah{" "}
              <strong>LPK (Lembaga Pelatihan Kerja)</strong> dan{" "}
              <strong>LKP (Lembaga Kursus dan Pelatihan)</strong> yang telah
              memiliki izin resmi.
            </p>
            <p>
              Tersedia berbagai kursus dan pelatihan yang dirancang untuk
              membekali kamu dengan keterampilan yang benar-benar dibutuhkan di
              dunia kerja — dari dasar hingga siap terjun langsung ke industri.
            </p>
            <ul className="credential-list">
              <li>
                {check}
                Lembaga pelatihan &amp; kursus berizin resmi
              </li>
              <li>
                {check}
                Program disusun sesuai kebutuhan industri
              </li>
              <li>
                {check}
                Pendampingan dari materi dasar hingga siap kerja
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function VisiMisi() {
  const misi = [
    "Menyediakan pendidikan dan pelatihan berkualitas yang sesuai dengan kebutuhan industri.",
    "Meningkatkan keterampilan dan daya saing peserta melalui program yang relevan dan inovatif.",
    "Membangun kemitraan dengan dunia usaha untuk membuka peluang kerja dan wirausaha.",
    "Membekali peserta dengan nilai-nilai profesionalisme dan etika kerja yang tinggi.",
  ];

  const icons = [
    <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V5.6c0-.6.4-1 1-1.1 2-.3 5 .1 7 1.5 2-1.4 5-1.8 7-1.5.6.1 1 .5 1 1.1v13.9" />
      <path d="M4 19.5c2-.3 5 .1 7 1.5 2-1.4 5-1.8 7-1.5" />
    </svg>,
    <svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 6" />
      <polyline points="15 6 21 6 21 12" />
    </svg>,
    <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5L4 19v-3.5L8.5 11" />
      <path d="M15.5 14.5L20 19v-3.5L15.5 11" />
      <path d="M8.5 11c1.2-1.4 2.8-2 3.5-2s2.3.6 3.5 2" />
      <path d="M9 8c.6-1 1.8-1.6 3-1.6S14.4 7 15 8" />
    </svg>,
    <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
      <path d="M9.5 12l1.8 1.8L14.5 10" />
    </svg>,
  ];

  return (
    <section className="section" id="visimisi">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="kicker">Visi &amp; Misi</span>
          <h2>Arah yang menuntun setiap program kami</h2>
        </Reveal>
        <div className="vm-grid">
          <Reveal className="visi-card">
            <div>
              <span className="kicker">Visi</span>
              <p>
                Menjadi lembaga unggul dalam menciptakan sumber daya manusia
                yang kompeten, kreatif, dan siap kerja di berbagai sektor,
                berkontribusi pada pembangunan ekonomi dan sosial.
              </p>
            </div>
            <svg
              className="feather-mark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.5 3.5c-4 0-9 2-11.5 7.5C6.5 15.5 5 19 3 21c3-1 6-1.5 9-3 5-2.5 8.5-7 8.5-14.5z" />
              <line x1="9" y1="14.5" x2="4" y2="19.5" />
            </svg>
          </Reveal>
          <Reveal className="misi-list">
            {misi.map((m, i) => (
              <div className="misi-item" key={i}>
                <div className="icon-box">{icons[i]}</div>
                <p>{m}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
