"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "@/components/site/Reveal";
import Rich from "@/components/site/Rich";
import { textOf, type ContentMap } from "@/lib/siteContent";

const MAP_IMG =
  "https://staticmap.openstreetmap.de/staticmap.php?center=-6.4428355,106.8106061&zoom=16&size=900x480&maptype=mapnik&markers=-6.4428355,106.8106061,lightblue1";

/** Frame peta lokasi — mempertahankan fallback onerror dari v1. */
export default function MapFrame({ c }: { c: ContentMap }) {
  const [failed, setFailed] = useState(false);

  return (
    <Reveal>
    <a
      href="https://maps.app.goo.gl/8H3ubXoMtussHD839"
      target="_blank"
      rel="noopener"
      className="map-frame"
    >
      <span className="map-chip">
        <Rich text={textOf(c, "lokasi.petaChip")} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>

      {!failed ? (
        <Image
          src={MAP_IMG}
          alt="Peta Lokasi Talenta Cipta Karya"
          width={900}
          height={480}
          unoptimized
          // Peta ada di bawah lipatan: jangan ikut menempati jalur render awal.
          // Sumbernya kadang tidak terjangkau (ERR_CONNECTION_CLOSED) —
          // `onError` lalu menampilkan kartu alamat di bawah.
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="map-fallback" style={{ display: "flex" }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <strong>
            <Rich text={textOf(c, "lokasi.cardTitle")} />
          </strong>
          <span>
            <Rich text={textOf(c, "lokasi.alamat")} />
          </span>
        </span>
      )}
    </a>
    </Reveal>
  );
}

export function Lokasi({ c }: { c: ContentMap }) {
  return (
    <section className="section lokasi-dark" id="lokasi">
      <div className="wrap">
        <Reveal className="section-head" style={{ marginBottom: 44 }}>
          <span className="kicker kicker-light">
            <Rich text={textOf(c, "lokasi.kicker")} />
          </span>
          <h2 style={{ color: "#fff", fontSize: "clamp(28px,3.4vw,40px)" }}>
            <Rich text={textOf(c, "lokasi.title")} />
          </h2>
          <p
            style={{
              color: "#C4CDE8",
              marginTop: 14,
              fontSize: 15.5,
              maxWidth: 480,
            }}
          >
            Program Pelatihan Barista berlokasi langsung di kedai mitra kami,
            gampang ditemukan lewat Google Maps.
          </p>
        </Reveal>
        <div className="lokasi-grid">
          <Reveal className="lokasi-card">
            <span className="rating-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z" />
              </svg>
              <Rich text={textOf(c, "lokasi.rating")} />
            </span>
            <h3><Rich text={textOf(c, "lokasi.cardTitle")} /></h3>
            <p className="lokasi-desc">
              Talenta Cipta Karya menjalankan pelatihan Barista langsung di
              lokasi mitra ini. Konfirmasi jadwal &amp; ketersediaan kelas lewat
              WhatsApp sebelum datang.
            </p>
            <div className="lokasi-actions">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-6.4428355,106.8106061"
                target="_blank"
                rel="noopener"
                className="btn btn-cream"
              >
                <Rich text={textOf(c, "lokasi.cta")} />
              </a>
            </div>
          </Reveal>
          <MapFrame c={c} />
        </div>
      </div>
    </section>
  );
}
