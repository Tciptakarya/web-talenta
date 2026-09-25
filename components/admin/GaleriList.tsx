"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  deleteGalleryImage,
  moveGalleryImage,
  updateGalleryImage,
  type ActionState,
} from "@/app/admin/actions";

/** Opsi program untuk dropdown di form edit/upload. */
export type AdminGalleryProgram = {
  id: number;
  judul: string;
  categoryId: number | null;
};

export type AdminGalleryItem = {
  id: number;
  url: string;
  caption: string;
  alt?: string | null;
  /** Urutan tampil di publik (kecil = lebih dulu) — diatur lewat tombol ↑/↓. */
  urutan: number;
  category: { id: number; name: string } | null;
  program: { id: number; judul: string } | null;
};

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1";
const badgeCls =
  "inline-block rounded-full text-xs font-bold px-2.5 py-1 whitespace-nowrap";

/**
 * Satu kartu foto: pratinjau, badge kategori/program, tombol urutan ↑/↓,
 * edit inline (caption/alt/kategori/program), dan hapus.
 */
function GaleriCard({
  item,
  categories,
  programs,
  isFirst,
  isLast,
}: {
  item: AdminGalleryItem;
  categories: { id: number; name: string }[];
  programs: AdminGalleryProgram[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  // Kategori terpilih di form edit — menentukan opsi program yang relevan.
  const [kategoriTerpilih, setKategoriTerpilih] = useState(
    item.category ? String(item.category.id) : ""
  );
  const [state, action, pending] = useActionState<
    ActionState | undefined,
    FormData
  >(updateGalleryImage, undefined);

  const programRelevan = kategoriTerpilih
    ? programs.filter((p) => p.categoryId === Number(kategoriTerpilih))
    : programs;

  return (
    <div className="rounded-2xl bg-white border border-line overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-line">
        <Image
          src={item.url}
          alt={item.alt || item.caption}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy/85 text-white text-xs font-bold px-2.5 py-1">
          #{item.urutan}
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <p className="text-sm font-bold text-navy line-clamp-2">{item.caption}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${badgeCls} bg-paper text-blue`}>
            {item.category?.name ?? "—"}
          </span>
          {item.program && (
            <span className={`${badgeCls} bg-emerald-50 text-emerald-700`}>
              {item.program.judul}
            </span>
          )}
        </div>

        {editing ? (
          <form
            action={action}
            className="space-y-2.5 rounded-xl bg-paper border border-line p-3"
          >
            <input type="hidden" name="id" value={item.id} />
            <div>
              <label htmlFor={`caption-${item.id}`} className={labelCls}>
                Caption
              </label>
              <input
                id={`caption-${item.id}`}
                name="caption"
                required
                minLength={2}
                maxLength={200}
                defaultValue={item.caption}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={`alt-${item.id}`} className={labelCls}>
                Alt teks (opsional)
              </label>
              <input
                id={`alt-${item.id}`}
                name="alt"
                maxLength={300}
                defaultValue={item.alt ?? ""}
                placeholder="Deskripsi singkat untuk pembaca layar"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor={`kategori-${item.id}`} className={labelCls}>
                  Kategori
                </label>
                <select
                  id={`kategori-${item.id}`}
                  name="categoryId"
                  required
                  value={kategoriTerpilih}
                  onChange={(e) => setKategoriTerpilih(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— Pilih —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`program-${item.id}`} className={labelCls}>
                  Program (opsional)
                </label>
                <select
                  id={`program-${item.id}`}
                  name="programId"
                  defaultValue={item.program ? String(item.program.id) : ""}
                  className={inputCls}
                >
                  <option value="">— Tanpa program —</option>
                  {programRelevan.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.judul}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {state?.error && (
              <p className="text-xs font-semibold text-red-600">{state.error}</p>
            )}
            {state?.ok && (
              <p className="text-xs font-semibold text-blue">{state.message}</p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-navy text-white text-xs font-bold px-4 py-2 hover:-translate-y-0.5 transition disabled:opacity-70"
              >
                {pending ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-line bg-white text-xs font-bold px-4 py-2 text-navy"
              >
                Selesai
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <form action={moveGalleryImage}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="arah" value="up" />
                <button
                  type="submit"
                  disabled={isFirst}
                  aria-label={`Naikkan urutan foto ${item.caption}`}
                  className="w-8 h-8 grid place-items-center rounded-lg border border-line bg-white text-navy font-bold hover:border-blue disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
              </form>
              <form action={moveGalleryImage}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="arah" value="down" />
                <button
                  type="submit"
                  disabled={isLast}
                  aria-label={`Turunkan urutan foto ${item.caption}`}
                  className="w-8 h-8 grid place-items-center rounded-lg border border-line bg-white text-navy font-bold hover:border-blue disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
              </form>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs font-bold text-blue hover:underline"
              >
                Edit
              </button>
              <form
                action={deleteGalleryImage}
                onSubmit={(e) => {
                  if (!confirm(`Hapus foto "${item.caption}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Daftar foto galeri — edit inline, atur urutan, hapus. */
export default function GaleriList({
  items,
  categories,
  programs,
}: {
  items: AdminGalleryItem[];
  categories: { id: number; name: string }[];
  programs: AdminGalleryProgram[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-mist">Belum ada foto di galeri.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <GaleriCard
          key={item.id}
          item={item}
          categories={categories}
          programs={programs}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}