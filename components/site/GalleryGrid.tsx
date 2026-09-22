"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/site/Reveal";

export type GalleryItem = {
  id: number;
  url: string;
  caption: string;
  alt?: string | null;
};

type LightboxState = { src: string; alt: string; caption: string } | null;

/** Galeri + lightbox (script.js v1 bagian lightbox, aksesibilitas dipertahankan). */
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const open = (item: GalleryItem) => {
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    setLightbox({
      src: item.url,
      alt: item.alt || item.caption,
      caption: item.caption,
    });
  };

  const closeBox = useCallback(() => {
    setLightbox(null);
    lastFocusedRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBox();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [lightbox, closeBox]);

  if (items.length === 0) return null;

  return (
    <>
      <Reveal className="gallery-grid">
        {items.map((item) => (
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

      {lightbox && (
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
            {/* src sudah diambil dari galeri di atas (sama, ada di cache) */}
            <img src={lightbox.src} alt={lightbox.alt} />
            <p className="lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
