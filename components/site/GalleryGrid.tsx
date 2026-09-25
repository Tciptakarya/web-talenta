"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/site/Reveal";

export type GalleryProgram = { id: number; judul: string; slug: string };

export type GalleryItem = {
  id: number;
  url: string;
  caption: string;
  alt?: string | null;
  /** Program opsional — dipakai untuk filter chip di dalam kategori. */
  program?: GalleryProgram | null;
};

/**
 * Galeri + lightbox (script.js v1 bagian lightbox, aksesibilitas dipertahankan).
 * Bila satu kategori memuat ≥2 program berfoto, muncul chip filter per program
 * (mis. "semua foto Barista") — galeri tetap satu section, tanpa section kosong.
 */
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filterProgram, setFilterProgram] = useState<number | null>(null);
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const programTersedia = useMemo(() => {
    const map = new Map<number, string>();
    items.forEach((i) => {
      if (i.program) map.set(i.program.id, i.program.judul);
    });
    return [...map.entries()].map(([id, judul]) => ({ id, judul }));
  }, [items]);

  const tampil = useMemo(
    () =>
      filterProgram === null
        ? items
        : items.filter((i) => i.program?.id === filterProgram),
    [items, filterProgram]
  );

  const indeksAktif =
    lightboxId === null ? -1 : tampil.findIndex((i) => i.id === lightboxId);
  const aktif = indeksAktif >= 0 ? tampil[indeksAktif] : undefined;
  const bisaPrev = indeksAktif > 0;
  const bisaNext = indeksAktif >= 0 && indeksAktif < tampil.length - 1;

  const open = (item: GalleryItem) => {
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    setLightboxId(item.id);
  };

  const closeBox = useCallback(() => {
    setLightboxId(null);
    lastFocusedRef.current?.focus?.();
  }, []);

  /** Geser foto aktif di lightbox; tetap dibatasi daftar yang sedang tampil. */
  const geser = useCallback(
    (arah: -1 | 1) => {
      setLightboxId((current) => {
        if (current === null) return current;
        const index = tampil.findIndex((i) => i.id === current);
        if (index < 0) return current;
        const target = index + arah;
        if (target < 0 || target >= tampil.length) return current;
        return tampil[target]?.id ?? current;
      });
    },
    [tampil]
  );

  useEffect(() => {
    if (lightboxId === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowLeft") geser(-1);
      if (e.key === "ArrowRight") geser(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [lightboxId, closeBox, geser]);

  if (items.length === 0) return null;

  const chipAktif = "bg-navy text-white";
  const chipIdle = "bg-white text-navy border border-line hover:bg-paper";

  return (
    <>
      {/* Filter program — hanya bila kategori ini memuat ≥2 program berfoto */}
      {programTersedia.length > 1 && (
        <div
          className="flex flex-wrap justify-center gap-2 mb-6"
          role="group"
          aria-label="Filter program galeri"
        >
          <button
            type="button"
            onClick={() => setFilterProgram(null)}
            aria-pressed={filterProgram === null}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
              filterProgram === null ? chipAktif : chipIdle
            }`}
          >
            Semua ({items.length})
          </button>
          {programTersedia.map((p) => {
            const jumlah = items.filter((i) => i.program?.id === p.id).length;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilterProgram(p.id)}
                aria-pressed={filterProgram === p.id}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filterProgram === p.id ? chipAktif : chipIdle
                }`}
              >
                {p.judul} ({jumlah})
              </button>
            );
          })}
        </div>
      )}

      <Reveal className="gallery-grid">
        {tampil.map((item) => (
          <div
            key={item.id}
            className="gallery-item"
            role="button"
            tabIndex={0}
            aria-label={`Perbesar foto: ${item.caption}`}
            onClick={() => open(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(item);
              }
            }}
          >
            <Image
              src={item.url}
              alt={item.alt || item.caption}
              fill
              sizes="(max-width: 520px) 50vw, (max-width: 980px) 50vw, 33vw"
            />
            <div className="gallery-caption">{item.caption}</div>
          </div>
        ))}
      </Reveal>

      {aktif && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan foto galeri"
        >
          <button
            type="button"
            className="lightbox-backdrop"
            aria-label="Tutup tampilan foto"
            onClick={closeBox}
          />
          <div className="lightbox-content" role="document">
            <button
              type="button"
              className="lightbox-close"
              aria-label="Tutup tampilan foto"
              onClick={closeBox}
              autoFocus
            >
              &times;
            </button>

            {bisaPrev && (
              <button
                type="button"
                className="lightbox-nav lightbox-nav--prev"
                aria-label="Foto sebelumnya"
                onClick={() => geser(-1)}
              >
                ‹
              </button>
            )}
            {bisaNext && (
              <button
                type="button"
                className="lightbox-nav lightbox-nav--next"
                aria-label="Foto berikutnya"
                onClick={() => geser(1)}
              >
                ›
              </button>
            )}

            {/* src sudah diambil dari galeri di atas (sama, ada di cache) */}
            <img src={aktif.url} alt={aktif.alt || aktif.caption} />
            <p className="lightbox-caption">
              {aktif.program ? `${aktif.program.judul} · ` : ""}
              {aktif.caption}
              <span className="lightbox-counter">
                {" "}
                ({indeksAktif + 1}/{tampil.length})
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

