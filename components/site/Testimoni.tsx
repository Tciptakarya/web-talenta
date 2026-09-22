import Reveal from "@/components/site/Reveal";
import type { TestimonialRow } from "@/lib/data";

/** Testimoni — data dari database, bisa ditambah/diedit admin tanpa deploy. */
export default function Testimoni({ items }: { items: TestimonialRow[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section" id="testimoni">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="kicker">Testimoni</span>
          <h2>Cerita dari mereka yang sudah berkarya</h2>
        </Reveal>
        <Reveal className="testi-grid">
          {items.map((t) => (
            <div className="testi-card" key={t.id}>
              <svg
                className="quote-mark"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 8c-2.2 0-4 1.8-4 4v6h6v-6H6c0-1.1.9-2 2-2V8zm11 0c-2.2 0-4 1.8-4 4v6h6v-6h-3c0-1.1.9-2 2-2V8z" />
              </svg>
              <p className="msg">{t.pesan}</p>
              <div className="testi-who">
                <div className="testi-avatar" aria-hidden="true">
                  {t.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{t.nama}</strong>
                  <span>{t.peran}</span>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
