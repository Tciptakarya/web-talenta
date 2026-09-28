import Reveal from "@/components/site/Reveal";
import Rich from "@/components/site/Rich";
import { textOf, type ContentMap } from "@/lib/siteContent";

/** Hero v1 — konten statis (brand), tanpa reveal (terlihat langsung). */
export default function Hero({ c }: { c: ContentMap }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <div className="hero-eyebrow-row">
            <span className="badge-pill">
              <span className="dot" />
              <Rich text={textOf(c, "hero.badge")} />
            </span>
          </div>
          <h1>
            <Rich text={textOf(c, "hero.title")} />
          </h1>
          <p className="lead">
            <Rich text={textOf(c, "hero.lead")} />
          </p>
          <div className="hero-actions">
            <a href="#layanan" className="btn btn-primary">
              <Rich text={textOf(c, "hero.cta1")} />
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
              <Rich text={textOf(c, "hero.cta2")} />
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>
                <Rich text={textOf(c, "hero.stat1a")} />
              </strong>
              <span>
                <Rich text={textOf(c, "hero.stat1b")} />
              </span>
            </div>
            <div>
              <strong>
                <Rich text={textOf(c, "hero.stat2a")} />
              </strong>
              <span>
                <Rich text={textOf(c, "hero.stat2b")} />
              </span>
            </div>
            <div>
              <strong>
                <Rich text={textOf(c, "hero.stat3a")} />
              </strong>
              <span>
                <Rich text={textOf(c, "hero.stat3b")} />
              </span>
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
            <strong>
              <Rich text={textOf(c, "hero.cardTitle")} />
            </strong>
            <span>
              <Rich text={textOf(c, "hero.cardText")} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About({ c }: { c: ContentMap }) {
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
            <span className="kicker">
              <Rich text={textOf(c, "about.kicker")} />
            </span>
            <h2
              style={{
                marginTop: 14,
                fontSize: "clamp(28px,3.2vw,38px)",
              }}
            >
              <Rich text={textOf(c, "about.title")} />
            </h2>
          </Reveal>
          <Reveal className="about-copy">
            <p>
              <Rich text={textOf(c, "about.body1")} />
            </p>
            <p>
              <Rich text={textOf(c, "about.body2")} />
            </p>
            <ul className="credential-list">
              <li>
                {check}
                <Rich text={textOf(c, "about.bullet1")} />
              </li>
              <li>
                {check}
                <Rich text={textOf(c, "about.bullet2")} />
              </li>
              <li>
                {check}
                <Rich text={textOf(c, "about.bullet3")} />
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function VisiMisi({ c }: { c: ContentMap }) {
  // Isi misi diambil dari Tampilan Website (dengan nilai bawaan di registry).
  const misi = [
    textOf(c, "visimisi.misi1"),
    textOf(c, "visimisi.misi2"),
    textOf(c, "visimisi.misi3"),
    textOf(c, "visimisi.misi4"),
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
          <span className="kicker">
            <Rich text={textOf(c, "visimisi.kicker")} />
          </span>
          <h2>
            <Rich text={textOf(c, "visimisi.title")} />
          </h2>
        </Reveal>
        <div className="vm-grid">
          <Reveal className="visi-card">
            <div>
              <span className="kicker">
                <Rich text={textOf(c, "visimisi.visiKicker")} />
              </span>
              <p>
                <Rich text={textOf(c, "visimisi.visi")} />
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
