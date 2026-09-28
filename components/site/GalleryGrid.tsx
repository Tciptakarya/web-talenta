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
  /** Tahun kegiatan foto — sub-grup di bawah program (null = "Tanpa Tahun"). */
  year?: number | null;
  /** Level grouping UTAMA galeri publik (PROGRAM → TAHUN → FOTO). */
  program?: GalleryProgram | null;
  /** Metadata + fallback grouping bila foto tidak punya program. */
  category?: { id: number; name: string } | null;
};

/** Label foto lama yang tahunnya belum diatur — tetap ditampil, jangan dihapus. */
const TANPA_TAHUN = "Tanpa Tahun";

/** Satu sub-grup tahun di dalam satu program. */
type KelompokTahun = {
  key: string; // "2026" | "none"
  label: string; // "2026" | "Tanpa Tahun"
  urut: number; // tahun numerik; -1 untuk "Tanpa Tahun" (selalu paling bawah)
  items: GalleryItem[];
};

/** Satu grup program (level utama). */
type KelompokProgram = {
  key: string; // "p1" (program) | "c2" (fallback kategori) | "lainnya"
  nama: string; // judul program, atau nama kategori bila foto tanpa program
  kategori: string | null;
  dariProgram: boolean;
  items: GalleryItem[];
  tahun: KelompokTahun[]; // terbaru di atas, "Tanpa Tahun" di bawah
};

/**
 * Kelompokkan foto PROGRAM → TAHUN di sisi klien dari satu query yang sudah
 * di-include (category + program) — tanpa query tambahan / N+1.
 *
 * Aturan:
 * - Urutan grup = kemunculan pertama (data dari server sudah terurut `urutan`
 *   asc), jadi tidak ada hardcode nama program/kategori.
 * - Foto TANPA program jatuh ke grup namanya kategori (bukan hilang); bila
 *   kategori juga kosong → "Lainnya".
 * - Tahun: terbaru di atas; `year = null` → grup "Tanpa Tahun" paling bawah.
 * - Grup kosong tidak pernah dibentuk (dibentuk hanya saat ada fotonya).
 */
function buildGroups(items: GalleryItem[]): KelompokProgram[] {
  const map = new Map<string, KelompokProgram>();

  for (const item of items) {
    const dariProgram = Boolean(item.program);
    const key = item.program
      ? `p${item.program.id}`
      : item.category
        ? `c${item.category.id}`
        : "lainnya";
    const nama = item.program?.judul ?? item.category?.name ?? "Lainnya";

    let grup = map.get(key);
    if (!grup) {
      grup = {
        key,
        nama,
        kategori: item.category?.name ?? null,
        dariProgram,
        items: [],
        tahun: [],
      };
      map.set(key, grup);
    }
    grup.items.push(item);

    const tahunKey = item.year == null ? "none" : String(item.year);
    let tahun = grup.tahun.find((t) => t.key === tahunKey);
    if (!tahun) {
      tahun = {
        key: tahunKey,
        label: item.year == null ? TANPA_TAHUN : String(item.year),
        urut: item.year ?? -1,
        items: [],
      };
      grup.tahun.push(tahun);
    }
    tahun.items.push(item);
  }

  for (const grup of map.values()) {
    grup.tahun.sort((a, b) => b.urut - a.urut); // terbaru dulu; null (-1) di bawah
  }
  return [...map.values()];
}

/**
 * Galeri publik: PROGRAM → TAHUN → FOTO + lightbox (aksesibilitas dipertahankan).
 *
 * - Chip filter per program (bila ada >1 grup).
 * - Tiap tahun berbentuk accordion; default hanya TAHUN TERBARU tiap program
 *   yang terbuka supaya halaman tetap ringkas & mudah dipindai.
 * - Foto di tahun yang ciut TIDAK dirender (hemat DOM & request gambar).
 * - Tahun 2027, 2028, dst. otomatis muncul sebagai grup baru — tanpa ubah kode.
 */
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const groups = useMemo(() => buildGroups(items), [items]);
  const groupsTampil = useMemo(
    () => (filter ? groups.filter((g) => g.key === filter) : groups),
    [groups, filter]
  );
  /** Daftar untuk navigasi lightbox mengikuti urutan tampil (kiri → kanan). */
  const tampil = useMemo(
    () => groupsTampil.flatMap((g) => g.tahun.flatMap((t) => t.items)),
    [groupsTampil]
  );

  // Default accordion: tahun terbaru tiap program terbuka, sisanya ciut.
  // Grup/tahun baru yang muncul kemudian ikut terbuka (tidak ada di daftar).
  const [tutup, setTutup] = useState<Set<string>>(() => {
    const awal = new Set<string>();
    buildGroups(items).forEach((g) =>
      g.tahun.slice(1).forEach((t) => awal.add(`${g.key}|${t.key}`))
    );
    return awal;
  });

  const toggleTahun = (key: string) =>
    setTutup((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const indeksAktif =
    lightboxId === null ? -1 : tampil.findIndex((i) => i.id === lightboxId);
  const aktif = indeksAktif >= 0 ? tampil[indeksAktif] : undefined;
  const bisaPrev = indeksAktif > 0;
  const bisaNext = indeksAktif >= 0 && indeksAktif < tampil.length - 1;
  /** "Program · Tahun · " di depan caption lightbox (program → kategori bila kosong). */
  const metaAktif = aktif
    ? [
        aktif.program?.judul ?? aktif.category?.name,
        aktif.year != null ? String(aktif.year) : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

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

  /** Judul program hanya bila ada >1 grup (di halaman kategori tunggal
   *  judulnya redundan dengan judul section). */
  const tampilkanJudulProgram = groups.length > 1;

  return (
    <>
      {/* Filter program — hanya bila galeri memuat >1 grup berfoto.
          Styling chip ada di CSS (.gal-chip) agar token warnanya ikut
          berubah di mode gelap (utility Tailwind bg-white tidak). */}
      {groups.length > 1 && (
        <div
          className="flex flex-wrap justify-center gap-1.5 mb-8"
          role="group"
          aria-label="Filter program galeri"
        >
          <button
            type="button"
            onClick={() => setFilter(null)}
            aria-pressed={filter === null}
            className="gal-chip"
          >
            Semua ({items.length})
          </button>
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setFilter(g.key)}
              aria-pressed={filter === g.key}
              className="gal-chip"
            >
              {g.nama} ({g.items.length})
            </button>
          ))}
        </div>
      )}

      {groupsTampil.map((g) => {
        const kategoriBeda =
          g.dariProgram && g.kategori !== null && g.kategori !== g.nama;
        return (
          <section
            key={g.key}
            aria-label={`Galeri ${g.nama}`}
            className="mb-10 md:mb-14 last:mb-0"
          >
            {/* Kop program — editorial: judul prominent, kategori metadata kecil,
                dipisahkan garis tipis (bukan kartu). Kelas CSS — lihat globals.
                <div>, bukan <header>: rule global header{position:fixed} di
                globals.css khusus navbar — <header> mentah akan menempel di
                tepi kiri atas viewport. */}
            {tampilkanJudulProgram && (
              <div className="gallery-program">
                <h3 className="gallery-program-title text-navy">{g.nama}</h3>
                {kategoriBeda && (
                  <p className="gallery-program-kategori">
                    Kategori · {g.kategori}
                  </p>
                )}
              </div>
            )}

            {/* Daftar tahun — editorial list (bukan rounded-rectangle card). */}
            <div className="year-list">
              {g.tahun.map((t) => {
                const tkey = `${g.key}|${t.key}`;
                const terbuka = !tutup.has(tkey);
                const panelId = `tahun-${g.key}-${t.key}`;
                return (
                  <div key={t.key} className={`year-row${terbuka ? " is-open" : ""}`}>
                    <button
                      type="button"
                      onClick={() => toggleTahun(tkey)}
                      aria-expanded={terbuka}
                      aria-controls={terbuka ? panelId : undefined}
                      className="year-toggle"
                    >
                      {/* Thumbnail tahun — foto pertama tahun tersebut (image
                          existing, tanpa query/tambahan DB). Dekoratif. */}
                      <span className="year-thumb" aria-hidden="true">
                        <Image
                          src={t.items[0].url}
                          alt=""
                          width={72}
                          height={54}
                          loading="lazy"
                          sizes="72px"
                        />
                      </span>
                      <span className="year-label text-navy">{t.label}</span>
                      <span className="year-count">{t.items.length} Foto</span>
                      <span className="year-arrow" aria-hidden="true">
                        {terbuka ? "↑" : "→"}
                      </span>
                    </button>

                    {/* Foto di tahun yang ciut tidak dirender sama sekali. */}
                    {terbuka && (
                      <div id={panelId} className="year-panel">
                        <Reveal className="gallery-grid">
                          {t.items.map((item) => (
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
                                sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 25vw"
                              />
                              <div className="gallery-caption">{item.caption}</div>
                            </div>
                          ))}
                        </Reveal>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

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
              {metaAktif ? `${metaAktif} · ` : ""}
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
