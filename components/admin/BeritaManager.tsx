"use client";

import { useActionState, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  createBerita,
  deleteBerita,
  updateBerita,
  type ActionState,
} from "@/app/admin/actions";

/** Batas yang sama dengan `lib/schemas.ts` — dicek di client biar cepat. */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

const KATEGORI_SARAN = ["Pelatihan", "Kemitraan", "Sosial", "Prestasi", "Pengumuman"];

export type AdminBerita = {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;
  imageUrl: string | null;
  imageAlt: string | null;
  videoUrl: string | null;
  /** ID video (sudah dipisah dari host) atau null. */
  videoLink: string | null;
  videoHost: string | null;
  orientasi: "horizontal" | "vertical";
  /** "YYYY-MM-DD" di zona WIB — untuk <input type="date">. */
  tanggal: string;
  kategori: string | null;
  isActive: boolean;
};

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1.5";

type Pesan = { type: "ok" | "err"; msg: string } | null;

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Pesan error upload yang jujur dan spesifik.
 *
 * 413 = file melewati batas 4,5 MB per Function milik Vercel. Untuk VIDEO
 * ini seharusnya tidak muncul (video lewat client-direct), jadi kalau muncul
 * berarti ada yang salah dan pesannya harus menjelaskan itu, bukan
 * "Upload gagal".
 */
function pesanFromStatus(status: number, apa: "foto" | "video"): string {
  if (status === 413) {
    return `Ukuran ${apa} ditolak server sebelum diproses. Batas Vercel Function sekitar 4,5 MB per request. Untuk foto: kompres dulu. Untuk video: pastikan lewat tombol "Unggah Video" (bukan tempol path).`;
  }
  if (status === 401 || status === 403) {
    return "Sesi admin tidak valid. Muat ulang halaman lalu login kembali.";
  }
  if (status === 503) {
    return "Server belum bisa menyimpan berkas. Foto butuh Vercel Blob aktif; video butuh storage yang terhubung.";
  }
  if (status >= 500) {
    return `Server gagal menyimpan ${apa}. Coba lagi beberapa saat lagi.`;
  }
  return `Unggah ${apa} gagal. Coba lagi dengan berkas lain.`;
}

/* ------------------------------------------------------------------ */
/*  Kolom media: foto + video (unggah ATAU link YouTube/Vimeo)          */
/* ------------------------------------------------------------------ */

function MediaFields({
  imageUrl,
  imageAlt,
  videoUrl,
  videoLink,
  orientasi,
  idPrefix,
}: {
  imageUrl: string;
  imageAlt: string;
  videoUrl: string;
  videoLink: string;
  orientasi: "horizontal" | "vertical";
  /** Unik per form, supaya `id` label tidak bentrok saat form tambah & edit
      dirender bersamaan di halaman yang sama. */
  idPrefix: string;
}) {
  const [foto, setFoto] = useState(imageUrl);
  const [video, setVideo] = useState(videoUrl);
  const [link, setLink] = useState(videoLink);
  const [arah, setArah] = useState<"horizontal" | "vertical">(orientasi);
  const [pesan, setPesan] = useState<Pesan>(null);
  const [progres, setProgres] = useState<number | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const fileFoto = useRef<HTMLInputElement>(null);
  const fileVideo = useRef<HTMLInputElement>(null);

  async function unggahFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = ""; // izinkan pilih file yang sama lagi
    if (!f) return;

    if (!IMAGE_TYPES.includes(f.type)) {
      setPesan({ type: "err", msg: "Format foto harus JPG, PNG, atau WebP." });
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setPesan({
        type: "err",
        msg: `Ukuran foto ${formatBytes(f.size)} melebihi batas 8MB. Kompres dulu sebelum diunggah.`,
      });
      return;
    }

    setSibuk(true);
    setPesan(null);
    try {
      const body = new FormData();
      body.append("file", f);
      const res = await fetch("/api/upload/berita", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setPesan({ type: "err", msg: data.error ?? pesanFromStatus(res.status, "foto") });
        return;
      }
      setFoto(data.url);
      setPesan({ type: "ok", msg: `Foto terunggah (${formatBytes(f.size)}). Klik Simpan untuk menyimpan berita.` });
    } catch {
      setPesan({ type: "err", msg: "Jaringan bermasalah saat mengunggah foto." });
    } finally {
      setSibuk(false);
    }
  }

  async function unggahVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;

    if (!VIDEO_TYPES.includes(f.type)) {
      setPesan({ type: "err", msg: "Format video harus MP4 atau WebM." });
      return;
    }
    if (f.size > MAX_VIDEO_BYTES) {
      setPesan({
        type: "err",
        msg: `Ukuran video ${formatBytes(f.size)} melebihi batas 200MB. Untuk video yang lebih besar, pakai link YouTube.`,
      });
      return;
    }

    setSibuk(true);
    setPesan(null);
    setProgres(0);
    try {
      // Client-direct: file dikirim browser -> Vercel Blob, TIDAK lewat
      // server. Ini yang membuat batas 4,5 MB Vercel tidak berlaku.
      const blob = await upload(`berita/${f.name}`, f, {
        access: "public",
        handleUploadUrl: "/api/blob-token",
        onUploadProgress: ({ percentage }) => setProgres(percentage),
      });
      setVideo(blob.url);
      // Dua sumber video tidak boleh aktif bersamaan (dicek Zod di server).
      setLink("");
      setPesan({
        type: "ok",
        msg: `Video terunggah (${formatBytes(f.size)}). Klik Simpan untuk menyimpan berita.`,
      });
    } catch (err) {
      setPesan({
        type: "err",
        msg:
          err instanceof Error
            ? `Unggah video gagal: ${err.message}`
            : "Unggah video gagal. Untuk video besar, pakai link YouTube/Vimeo.",
      });
    } finally {
      setSibuk(false);
      setProgres(null);
    }
  }

  /** Ambil thumbnail YouTube supaya kartu berita tidak tanpa gambar. */
  async function ambilThumbnail() {
    const tervalidasi = link.trim();
    if (!tervalidasi) return;
    setSibuk(true);
    setPesan(null);
    try {
      const res = await fetch(
        `/api/upload/berita?konten=youtube&v=${encodeURIComponent(tervalidasi)}`
      );
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string | null;
        error?: string;
        info?: string;
      };
      if (!data.ok) {
        setPesan({ type: "err", msg: data.error ?? "Link video tidak dikenali." });
        return;
      }
      if (data.url) setFoto(data.url);
      setPesan({
        type: "ok",
        msg: data.info ?? "Thumbnail YouTube diambil sebagai foto utama.",
      });
    } catch {
      setPesan({ type: "err", msg: "Gagal mengambil thumbnail. Boleh-upload manual." });
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ---- Foto utama ---- */}
      <div>
        <label className={labelCls} htmlFor={`foto-${idPrefix}`}>
          Foto utama (opsional)
        </label>
        <input
          id={`foto-${idPrefix}`}
          ref={fileFoto}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={unggahFoto}
          disabled={sibuk}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue disabled:opacity-60"
        />
        <input type="hidden" name="imageUrl" value={foto} />
        {foto && (
          <div className="mt-2 flex items-center gap-3">
            {/* Preview memakai <img> biasa, bukan next/image: URL-nya bisa
                datang dari domain mana pun (Blob lokal/prod), dan di sini
                yang penting cuma konfirmasi admin, bukan performa. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto}
              alt=""
              className="h-16 w-24 rounded-lg object-cover border border-line"
            />
            <button
              type="button"
              onClick={() => setFoto("")}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Hapus foto
            </button>
          </div>
        )}
        <div className="mt-3">
        <label className={labelCls} htmlFor={`alt-${idPrefix}`}>
            Alt teks foto (untuk aksesibilitas)
          </label>
          <input
            id={`alt-${idPrefix}`}
            name="imageAlt"
            defaultValue={imageAlt}
            maxLength={300}
            placeholder="Deskripsi singkat foto, mis. Peserta praktik kelas barista"
            className={inputCls}
          />
        </div>
      </div>

      {/* ---- Video: unggah ATAU link ---- */}
      <div className="rounded-xl border border-line bg-paper p-4 space-y-3">
        <p className="text-xs font-bold text-navy">
          Video (opsional) — pilih salah satu: unggah ATAU link YouTube/Vimeo
        </p>

        <div>
          <label className={labelCls} htmlFor={`video-${idPrefix}-video`}>
            Unggah video (MP4/WebM, maks 200MB)
          </label>
          <input
            id={`video-${idPrefix}-video`}
            ref={fileVideo}
            type="file"
            accept="video/mp4,video/webm"
            onChange={unggahVideo}
            disabled={sibuk}
            className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue disabled:opacity-60"
          />
          {progres !== null && (
            <p className="mt-2 text-xs text-mist" role="status">
              Mengunggah video... {progres}%
            </p>
          )}
          <input type="hidden" name="videoUrl" value={video} />
          {video && (
            <button
              type="button"
              onClick={() => setVideo("")}
              className="mt-2 text-xs font-bold text-red-600 hover:underline"
            >
              Hapus video yang diunggah
            </button>
          )}
        </div>

        <p className="text-center text-[11px] font-bold text-mist uppercase tracking-widest">
          atau
        </p>

        <div>
          <label className={labelCls} htmlFor={`link-${idPrefix}-link`}>
            Tempel link YouTube / Vimeo / Instagram
          </label>
          <div className="flex gap-2">
            <input
              id={`link-${idPrefix}-link`}
              name="videoLink"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/shorts/..."
              className={inputCls}
            />
            <button
              type="button"
              onClick={ambilThumbnail}
              disabled={sibuk || !link.trim()}
              className="shrink-0 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-blue disabled:opacity-50"
              title="Ambil thumbnail YouTube sebagai foto utama"
            >
              Ambil thumbnail
            </button>
          </div>
          <p className="mt-1 text-xs text-mist">
            Untuk video panjang (&gt;200MB), pakai link YouTube — lebih ringan dan
            tidak memakai storage website. Instagram hanya bisa untuk konten{" "}
            <strong>publik</strong> yang creator-nya tidak mematikan Embeds;
            kalau tidak, Instagram menampilkan kartu cadangan berisi tautan.
          </p>
        </div>

        {/* ---- Orientasi video ---- */}
        <div>
          <span className={labelCls}>Orientasi video</span>
          <div
            role="radiogroup"
            aria-label="Orientasi video"
            className="flex flex-wrap gap-2"
          >
            {(
              [
                ["horizontal", "Mendatar (16:9)", "Video biasa, foto, atau YouTube biasa."],
                ["vertical", "Vertikal (9:16)", "YouTube Shorts & Reels."],
              ] as const
            ).map(([val, judul, ket]) => (
              <label
                key={val}
                className={`flex-1 min-w-[190px] cursor-pointer rounded-xl border-[1.5px] px-4 py-3 transition ${
                  arah === val ? "border-navy bg-paper" : "border-line bg-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orientasi"
                    value={val}
                    checked={arah === val}
                    onChange={() => setArah(val)}
                    className="h-4 w-4 accent-navy"
                  />
                  <strong className="text-xs text-navy">{judul}</strong>
                </span>
                <span className="mt-1 block text-[11px] text-mist">{ket}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-mist">
            Player YouTube selalu 16:9. Untuk video 9:16, pilih{" "}
            <strong>Vertikal</strong> supaya tidak cuma jadi kotak kecil di tengah
            layar lebar. Berlaku juga untuk file MP4 yang diunggah. Di daftar
            berita &amp; beranda, kartu tetap 16:9 supaya tinggi semua kartu
            seragam.
          </p>
        </div>
      </div>

      {pesan && (
        <p
          role="status"
          className={`text-sm font-semibold ${pesan.type === "ok" ? "text-blue" : "text-red-600"}`}
        >
          {pesan.msg}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Baris edit untuk satu berita                                       */
/* ------------------------------------------------------------------ */

function EditRow({ item }: { item: AdminBerita }) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateBerita,
    undefined
  );

  return (
    <div className="rounded-2xl bg-white border border-line p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-navy">{item.judul}</h3>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.isActive ? "Tayang" : "Draft"}
        </span>
      </div>

      <p className="text-xs text-mist break-all">
        /berita/{item.slug}
      </p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />

        <div>
          <label className={labelCls}>Judul berita</label>
          <input
            name="judul"
            required
            minLength={4}
            maxLength={180}
            defaultValue={item.judul}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Ringkasan (tampil di kartu daftar)</label>
          <textarea
            name="ringkasan"
            required
            minLength={10}
            maxLength={400}
            rows={2}
            defaultValue={item.ringkasan}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Isi berita — baris kosong jadi paragraf baru. Bisa **tebal** dan
            *miring*. Bukan HTML.
          </label>
          <textarea
            name="isi"
            required
            minLength={20}
            rows={10}
            defaultValue={item.isi}
            className={`${inputCls} font-mono text-[13px]`}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Tanggal kegiatan</label>
            <input
              name="tanggal"
              type="date"
              required
              defaultValue={item.tanggal}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Kategori (opsional)</label>
            <input
              name="kategori"
              list="kategori-berita-saran"
              maxLength={40}
              defaultValue={item.kategori ?? ""}
              placeholder="Pelatihan"
              className={inputCls}
            />
          </div>
          <div className="flex items-end gap-2 pb-2.5">
            <input
              id={`aktif-${item.id}`}
              name="isActive"
              type="checkbox"
              defaultChecked={item.isActive}
              className="h-4 w-4 accent-navy"
            />
            <label htmlFor={`aktif-${item.id}`} className="text-xs font-bold text-navy">
              Tayangkan di website
            </label>
          </div>
        </div>

        <MediaFields
          imageUrl={item.imageUrl ?? ""}
          imageAlt={item.imageAlt ?? ""}
          videoUrl={item.videoUrl ?? ""}
          videoLink={item.videoLink ?? ""}
          orientasi={item.orientasi}
          idPrefix={`edit-${item.id}`}
        />

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy text-white font-bold px-5 py-2.5 text-sm disabled:opacity-70"
        >
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        {state?.error && <p className="text-sm font-semibold text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm font-semibold text-blue">{state.message}</p>}
      </form>

      <form
        action={deleteBerita}
        className="flex justify-end pt-2 border-t border-line"
        onSubmit={(e) => {
          if (!confirm(`Hapus berita "${item.judul}"? Tindakan ini tidak bisa dibatalkan.`))
            e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="text-xs font-bold text-red-600 hover:underline">
          Hapus berita ini
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Halaman: form tambah + daftar                                       */
/* ------------------------------------------------------------------ */

export default function BeritaManager({ items }: { items: AdminBerita[] }) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    createBerita,
    undefined
  );
  // Default = hari ini, zona WIB (bukan zona server).
  const [hariIni] = useState(() => {
    const now = new Date();
    const wib = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60_000);
    return wib.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-8">
      <datalist id="kategori-berita-saran">
        {KATEGORI_SARAN.map((k) => (
          <option key={k} value={k} />
        ))}
      </datalist>

      <form
        action={action}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-navy">Tambah Berita</h2>

        <div>
          <label className={labelCls}>Judul berita</label>
          <input
            name="judul"
            required
            minLength={4}
            maxLength={180}
            placeholder="Pelatihan Barista Batch 12 Resmi Dilunkenkan"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Ringkasan (tampil di kartu daftar)</label>
          <textarea
            name="ringkasan"
            required
            minLength={10}
            maxLength={400}
            rows={2}
            placeholder="Satu-dua kalimat yang merangkum kabar ini."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Isi berita — baris kosong jadi paragraf baru. Bisa **tebal** dan
            *miring*. Bukan HTML.
          </label>
          <textarea
            name="isi"
            required
            minLength={20}
            rows={10}
            placeholder={"Tulis isi berita di sini.\n\nBaris kosong di atas akan jadi paragraf baru."}
            className={`${inputCls} font-mono text-[13px]`}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Tanggal kegiatan</label>
            <input
              name="tanggal"
              type="date"
              required
              defaultValue={hariIni}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-mist">Tanggal isi berita, bukan tanggal nulis.</p>
          </div>
          <div>
            <label className={labelCls}>Kategori (opsional)</label>
            <input
              name="kategori"
              list="kategori-berita-saran"
              maxLength={40}
              placeholder="Pelatihan"
              className={inputCls}
            />
          </div>
          <div className="flex items-end gap-2 pb-2.5">
            <input
              id="aktif-baru"
              name="isActive"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-navy"
            />
            <label htmlFor="aktif-baru" className="text-xs font-bold text-navy">
              Tayangkan di website
            </label>
          </div>
        </div>

        <MediaFields
          imageUrl=""
          imageAlt=""
          videoUrl=""
          videoLink=""
          orientasi="horizontal"
          idPrefix="baru"
        />

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm disabled:opacity-70"
        >
          {pending ? "Menyimpan..." : "Tambah Berita"}
        </button>

        {state?.error && (
          <p className="text-sm font-semibold text-red-600">{state.error}</p>
        )}
        {state?.ok && (
          <p className="text-sm font-semibold text-blue">{state.message}</p>
        )}
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-navy">
          Daftar Berita ({items.length})
        </h2>
        {items.length === 0 && (
          <p className="text-sm text-mist">
            Belum ada berita. Tambah lewat form di atas.
          </p>
        )}
        {items.map((item) => (
          <EditRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
