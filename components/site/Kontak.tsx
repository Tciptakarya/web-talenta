"use client";

import { useState } from "react";
import Reveal from "@/components/site/Reveal";

type Status = { type: "success" | "error"; message: string } | null;

/**
 * Form kontak fungsional (PRD §6):
 * submit → validasi → POST /api/contact → simpan DB + kirim email Resend.
 * Tombol WhatsApp tetap berdampingan sebagai opsi cepat (§12).
 */
export default function Kontak() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: String(fd.get("nama") ?? ""),
          email: String(fd.get("email") ?? ""),
          pesan: String(fd.get("pesan") ?? ""),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus({
          type: "error",
          message:
            data.error ||
            "Pesan belum terkirim. Coba lagi atau hubungi kami via WhatsApp.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Pesan terkirim! Tim kami akan segera menghubungi kamu.",
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message: "Jaringan bermasalah. Coba lagi atau hubungi kami via WhatsApp.",
      });
    } finally {
      setLoading(false);
      window.setTimeout(() => setStatus(null), 6000);
    }
  }

  return (
    <section className="section kontak" id="kontak">
      <div className="wrap">
        <div className="kontak-grid">
          <Reveal className="kontak-side">
            <span className="kicker">Hubungi Kami</span>
            <h2>Siap memulai langkah pertamamu?</h2>
            <p>
              Tinggalkan pesan dan tim kami akan segera menghubungi kamu untuk
              info program, jadwal, dan pendaftaran.
            </p>
            {/* WhatsApp dipertahankan sebagai opsi tambahan, bukan pengganti */}
            <a
              href="https://wa.me/628119700322?text=Halo%20Talenta%20Cipta%20Karya%2C%20saya%20ingin%20bertanya%20tentang%20program%20pelatihan."
              target="_blank"
              rel="noopener"
              className="btn btn-cream wa-btn"
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
              0811-9700-322
            </a>
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
          </Reveal>

          <Reveal className="kontak-form-wrap">
            <form className="kontak-form" onSubmit={onSubmit} noValidate={false}>
              <div className="field">
                <label htmlFor="nama">Nama</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  placeholder="Nama lengkap kamu"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nama@email.com"
                  required
                  maxLength={200}
                />
              </div>
              <div className="field">
                <label htmlFor="pesan">Pesan</label>
                <textarea
                  id="pesan"
                  name="pesan"
                  placeholder="Ceritakan program yang kamu minati..."
                  required
                  minLength={5}
                  maxLength={3000}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={loading}
                style={loading ? { opacity: 0.7 } : undefined}
              >
                {loading ? "Mengirim..." : "Kirim Pesan"}
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
              </button>
              <p
                className="form-status is-visible"
                role="status"
                aria-live="polite"
                style={
                  status
                    ? {
                        opacity: 1,
                        color: status.type === "error" ? "#C0392B" : undefined,
                      }
                    : { opacity: 0 }
                }
              >
                {status?.message ?? ""}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
