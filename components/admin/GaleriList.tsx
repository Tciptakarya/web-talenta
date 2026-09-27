"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
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
  /** Tahun kegiatan (2026, 2025, ...). Null = foto lama yang belum diatur. */
  year: number | null;
  category: { id: number; name: string } | null;
  program: { id: number; judul: string } | null;
};

/** Label khusus untuk foto yang kategori/program-nya kosong (tetap ditampilkan). */
const TANPA_KATEGORI = "Tanpa Kategori";
const TANPA_PROGRAM = "Tanpa Program";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1";
const badgeCls =
  "inline-block rounded-full text-xs font-bold px-2.5 py-1 whitespace-nowrap";

/** Satu subgroup program di dalam sebuah kategori. */
type SubGroup = {
  key: string;
  nama: string;
  items: AdminGalleryItem[];
};

/** Satu section kategori, berisi subgroup program. */
type Group = {
  key: string;
  nama: string;
  total: number;
  sub: SubGroup[];
};

/**
 * Grouping dilakukan di sisi klien dari data yang sudah diambil halaman
 * (satu query yang sudah men-`include` category & program) — tanpa query
 * tambahan dan tanpa risiko N+1.
 *
 * Aturan:
 * - `urutan` photo yang masuk dari server sudah terurut (asc), jadi urutan
 *   di dalam tiap subgroup mengikuti urutan publik yang sekarang berlaku.
 * - Kategori & program diurutkan alfabetis (ikut urutan di dropdown upload),
 *   dengan "Tanpa Kategori"/"Tanpa Program" selalu di akhir.
 * - Hanya kategori/program yang punya foto yang muncul (tidak pernah kosong).
 */
function buildGroups(items: AdminGalleryItem[]): Group[] {
  const byKategori = new Map<string, Group>();
  const byProgram = new Map<string, Map<string, SubGroup>>();

  for (const item of items) {
    const katKey = item.category ? `c${item.category.id}` : "c-none";
    const katNama = item.category?.name ?? TANPA_KATEGORI;
    let group = byKategori.get(katKey);
    if (!group) {
      group = { key: katKey, nama: katNama, total: 0, sub: [] };
      byKategori.set(katKey, group);
      byProgram.set(katKey, new Map());
    }
    group.total += 1;

    const proKey = item.program ? `p${item.program.id}` : "p-none";
    const proNama = item.program?.judul ?? TANPA_PROGRAM;
    const mapSub = byProgram.get(katKey)!;
    let sub = mapSub.get(proKey);
    if (!sub) {
      sub = { key: `${katKey}/${proKey}`, nama: proNama, items: [] };
      mapSub.set(proKey, sub);
      group.sub.push(sub);
    }
    sub.items.push(item);
  }

  const urutNama = (a: string, b: string) => a.localeCompare(b, "id");
  const groups = [...byKategori.values()];
  for (const g of groups) {
    g.sub.sort((a, b) => {
      // "Tanpa Program" selalu paling bawah.
      const aKosong = a.nama === TANPA_PROGRAM ? 1 : 0;
      const bKosong = b.nama === TANPA_PROGRAM ? 1 : 0;
      if (aKosong !== bKosong) return aKosong - bKosong;
      return urutNama(a.nama, b.nama);
    });
  }
  groups.sort((a, b) => {
    const aKosong = a.nama === TANPA_KATEGORI ? 1 : 0;
    const bKosong = b.nama === TANPA_KATEGORI ? 1 : 0;
    if (aKosong !== bKosong) return aKosong - bKosong;
    return urutNama(a.nama, b.nama);
  });
  return groups;
}

/**
 * Satu kartu foto: pratinjau, nomor urutan, tombol ↑/↓ (dalam subgroup),
 * edit inline (caption/alt/kategori/program), dan hapus.
 *
 * Badge kategori/program tidak lagi ditampilkan per kartu karena sudah
 * tercermin pada judul section & sub-section (grouping KATEGORI → PROGRAM).
 */
function GaleriCard({
  item,
  categories,
  programs,
  tahunTersedia,
  isFirst,
  isLast,
  prevId,
  nextId,
}: {
  item: AdminGalleryItem;
  categories: { id: number; name: string }[];
  programs: AdminGalleryProgram[];
  /** Opsi tahun untuk dropdown edit (terbaru di atas). */
  tahunTersedia: number[];
  /** True bila foto ini pertama di dalam subgroup-nya. */
  isFirst: boolean;
  /** True bila foto ini terakhir di dalam subgroup-nya. */
  isLast: boolean;
  /** Id foto tetangga sebelumnya/berikutnya DALAM subgroup yang sama. */
  prevId?: number | null;
  nextId?: number | null;
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

        {/* Tahun kegiatan — info utama agar admin tahu foto masuk grup tahun
            mana; peringatan bila belum diatur (foto lama tanpa sinyal tahun). */}
        <p className="text-xs font-semibold text-mist">
          Tahun :{" "}
          {item.year ? (
            <span className="text-navy font-bold">{item.year}</span>
          ) : (
            <span className="text-amber-600 font-bold">
              belum diatur — klik Edit
            </span>
          )}
        </p>

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
            <div>
              <label htmlFor={`tahun-${item.id}`} className={labelCls}>
                Tahun kegiatan (wajib)
              </label>
              <select
                id={`tahun-${item.id}`}
                name="year"
                required
                defaultValue={item.year ? String(item.year) : ""}
                className={inputCls}
              >
                <option value="" disabled>
                  — Pilih tahun —
                </option>
                {tahunTersedia.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
              <TombolUrutan
                item={item}
                arah="up"
                target={prevId}
                disabled={isFirst}
              />
              <TombolUrutan
                item={item}
                arah="down"
                target={nextId}
                disabled={isLast}
              />
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
                  if (!confirm(`Hapus foto "${item.caption}"?`))
                    e.preventDefault();
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

/** Tombol ↑/↓ — menukar urutan dengan foto tetangga di dalam subgroup yang sama. */
function TombolUrutan({
  item,
  arah,
  target,
  disabled,
}: {
  item: AdminGalleryItem;
  arah: "up" | "down";
  target?: number | null;
  disabled: boolean;
}) {
  return (
    <form action={moveGalleryImage}>
      <input type="hidden" name="id" value={item.id} />
      {target ? <input type="hidden" name="targetId" value={target} /> : null}
      <button
        type="submit"
        disabled={disabled || !target}
        aria-label={`${arah === "up" ? "Naikkan" : "Turunkan"} urutan foto ${item.caption}`}
        className="w-8 h-8 grid place-items-center rounded-lg border border-line bg-white text-navy font-bold hover:border-blue disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {arah === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}

/** Header kategori yang bisa diklik untuk expand/collapse. */
function HeaderKategori({
  group,
  terbuka,
  onToggle,
}: {
  group: Group;
  terbuka: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={terbuka}
      className="w-full flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left hover:border-blue transition"
    >
      <span
        aria-hidden="true"
        className="text-navy text-sm font-bold w-4 shrink-0"
      >
        {terbuka ? "▼" : "▶"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold text-navy truncate">
          {group.nama}
        </span>
        <span className="block text-xs text-mist">
          {group.total} foto · {group.sub.length} program
        </span>
      </span>
    </button>
  );
}

/** Header program (sub-section) yang juga bisa diklik. */
function HeaderProgram({
  sub,
  terbuka,
  onToggle,
}: {
  sub: SubGroup;
  terbuka: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={terbuka}
      className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-left hover:border-blue transition"
    >
      <span aria-hidden="true" className="text-blue text-xs font-bold w-3 shrink-0">
        {terbuka ? "▼" : "▶"}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold text-navy">
        {sub.nama}
      </span>
      <span className={`${badgeCls} bg-white text-mist border border-line`}>
        {sub.items.length} foto
      </span>
    </button>
  );
}

/**
 * Daftar foto galeri yang dikelompokkan KATEGORI → PROGRAM.
 * Setiap kategori & program bisa diklik untuk expand/collapse.
 */
export default function GaleriList({
  items,
  categories,
  programs,
  tahunTersedia,
}: {
  items: AdminGalleryItem[];
  categories: { id: number; name: string }[];
  programs: AdminGalleryProgram[];
  tahunTersedia: number[];
}) {
  const groups = useMemo(() => buildGroups(items), [items]);

  // Sedikit kategori → default terbuka. Banyak kategori → default ciut supaya
  // halaman tetap ringkas. Grup yang baru muncul tetap terbuka (tidak ada di
  // daftar "ciut").
  const semuaKey = useMemo(
    () => groups.flatMap((g) => g.sub.map((s) => `${g.key}|${s.key}`)),
    [groups]
  );
  const [ciut, setCiut] = useState<string[]>(() => {
    const awal = buildGroups(items);
    return awal.length > 4
      ? awal.flatMap((g) => g.sub.map((s) => `${g.key}|${s.key}`))
      : [];
  });
  const [ciutKategori, setCiutKategori] = useState<string[]>(() => {
    const awal = buildGroups(items);
    return awal.length > 4 ? awal.map((g) => g.key) : [];
  });

  if (items.length === 0) {
    return <p className="text-sm text-mist">Belum ada foto di galeri.</p>;
  }

  /** Foto lama yang tahunnya belum diatur — muncul sebagai grup "Tanpa Tahun". */
  const tanpaTahun = items.filter((i) => i.year === null).length;

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    key: string
  ) =>
    setter((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-mist">
          {groups.length} kategori · {semuaKey.length} program · {items.length}{" "}
          foto
          {tanpaTahun > 0 && (
            <span className="ml-2 font-bold text-amber-600">
              · {tanpaTahun} belum punya tahun
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCiutKategori([]);
              setCiut([]);
            }}
            className="rounded-full border border-line bg-white text-xs font-bold px-3.5 py-1.5 text-navy hover:border-blue transition"
          >
            Buka semua
          </button>
          <button
            type="button"
            onClick={() => {
              setCiutKategori(groups.map((g) => g.key));
              setCiut(semuaKey);
            }}
            className="rounded-full border border-line bg-white text-xs font-bold px-3.5 py-1.5 text-navy hover:border-blue transition"
          >
            Ciutkan semua
          </button>
        </div>
      </div>

      {groups.map((group) => {
        const kategoriTerbuka = !ciutKategori.includes(group.key);
        return (
          <section key={group.key} className="space-y-3">
            <HeaderKategori
              group={group}
              terbuka={kategoriTerbuka}
              onToggle={() => toggle(setCiutKategori, group.key)}
            />
            {kategoriTerbuka &&
              group.sub.map((sub) => {
                const key = `${group.key}|${sub.key}`;
                const subTerbuka = !ciut.includes(key);
                return (
                  <div key={sub.key} className="space-y-3 pl-1 sm:pl-4">
                    <HeaderProgram
                      sub={sub}
                      terbuka={subTerbuka}
                      onToggle={() => toggle(setCiut, key)}
                    />
                    {subTerbuka && (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sub.items.map((item, i) => (
                          <GaleriCard
                            key={item.id}
                            item={item}
                            categories={categories}
                            programs={programs}
                            tahunTersedia={tahunTersedia}
                            isFirst={i === 0}
                            isLast={i === sub.items.length - 1}
                            prevId={sub.items[i - 1]?.id ?? null}
                            nextId={sub.items[i + 1]?.id ?? null}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </section>
        );
      })}
    </div>
  );
}
