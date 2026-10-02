"use client";

import { useMemo, useState } from "react";
import BeritaCard from "@/components/site/BeritaCard";
import type { BeritaRow } from "@/lib/berita-types";

/**
 * Daftar berita + filter kategori (client component).
 *
 * **Kenapa filter-nya di browser, bukan lewat query string?**
 * Halaman `/berita` memakai `revalidate = 60` + `force-static` supaya fully
 * static (sama seperti `/kelas/[slug]`). Kalau filter memakai `?kategori=`,
 * `searchParams` akan membuat Next 15 merender halaman on-demand lalu
 * mengirim `no-store` — TTFB halaman berita jadi jauh lebih lambat dari
 * halaman lain, persis masalah yang sudah pernah diperbaiki di project ini.
 *
 * Karena data berita sendiri kecil (puluhan baris, sudah ikut ter-cache di
 * HTML), menyaring di browser lebih murah daripada merender ulang di server.
 */
export default function BeritaList({
  items,
  kategori,
}: {
  items: BeritaRow[];
  /** Kategori yang benar-benar dipakai berita aktif. */
  kategori: string[];
}) {
  const [dipilih, setDipilih] = useState("");

  const terlihat = useMemo(
    () => (dipilih ? items.filter((b) => b.kategori === dipilih) : items),
    [items, dipilih]
  );

  return (
    <>
      {kategori.length > 1 && (
        <div className="berita-filter" role="group" aria-label="Filter berita per kategori">
          <button
            type="button"
            onClick={() => setDipilih("")}
            className={dipilih ? "" : "is-active"}
            aria-pressed={dipilih === ""}
          >
            Semua
          </button>
          {kategori.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setDipilih(k)}
              className={k === dipilih ? "is-active" : ""}
              aria-pressed={k === dipilih}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {terlihat.length > 0 ? (
        <div className="berita-grid berita-grid--page">
          {terlihat.map((item, i) => (
            <BeritaCard key={item.id} item={item} priority={i < 3} compact />
          ))}
        </div>
      ) : (
        <p className="berita-kosong">
          Belum ada berita pada kategori ini.
        </p>
      )}
    </>
  );
}
