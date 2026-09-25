"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminGalleryProgram } from "@/components/admin/GaleriList";

type UploadFormProps = {
  categories: { id: number; name: string }[];
  programs: AdminGalleryProgram[];
};

/** Maksimal foto per batch & jumlah unggahan paralel (hemat memori server). */
const MAX_FILES = 20;
const KONKURENSI = 2;
/** Samakan dengan MAX_IMAGE_BYTES (lib/schemas.ts) — ditolak sebelum dikirim. */
const MAX_BYTES = 8 * 1024 * 1024;

type AntreanStatus = "menunggu" | "mengunggah" | "berhasil" | "gagal";
type Antrean = { nama: string; ukuran: number; status: AntreanStatus; pesan?: string };

function formatUkuran(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

/**
 * Form upload galeri — mendukung BANYAK foto sekaligus.
 * Satu batch memakai kategori/caption yang sama; tiap foto dikirim ke
 * /api/upload satu per satu (2 paralel) dengan status per file. Koreksi caption
 * atau kategori per foto dilakukan lewat tombol "Edit" di daftar bawah.
 */
export default function UploadForm({ categories, programs }: UploadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [antrean, setAntrean] = useState<Antrean[]>([]);
  const [kategoriId, setKategoriId] = useState("");
  /** Diubah untuk mereset <input type="file"> tanpa mengganggu field lain. */
  const [inputKey, setInputKey] = useState(0);

  const programRelevan = kategoriId
    ? programs.filter((p) => p.categoryId === Number(kategoriId))
    : programs;

  function tambahFile(daftar: FileList | null) {
    if (!daftar || daftar.length === 0) return;
    const slot = MAX_FILES - files.length;
    if (slot <= 0) {
      setStatus({
        type: "err",
        msg: `Maksimal ${MAX_FILES} foto per batch. Unggah dulu sebelum menambah lagi.`,
      });
      return;
    }
    const dipakai = Array.from(daftar).slice(0, slot);
    if (dipakai.length < daftar.length) {
      setStatus({
        type: "err",
        msg: `Hanya ${dipakai.length} foto pertama diambil (batas ${MAX_FILES} per batch).`,
      });
    }
    setFiles((prev) => [...prev, ...dipakai]);
    setAntrean((prev) => [
      ...prev,
      ...dipakai.map((f) => ({
        nama: f.name,
        ukuran: f.size,
        status: "menunggu" as const,
      })),
    ]);
  }

  function hapusDariAntrean(index: number) {
    if (loading) return;
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setAntrean((prev) => prev.filter((_, i) => i !== index));
  }

  function bersihkan() {
    if (loading) return;
    setFiles([]);
    setAntrean([]);
    setStatus(null);
    setInputKey((k) => k + 1);
  }

  function setStatusFile(index: number, patch: Partial<Antrean>) {
    setAntrean((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f))
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const categoryId = String(fd.get("categoryId") ?? "");
    const programId = String(fd.get("programId") ?? "");
    const caption = String(fd.get("caption") ?? "").trim();
    const alt = String(fd.get("alt") ?? "");

    if (files.length === 0) {
      setStatus({ type: "err", msg: "Pilih minimal satu foto." });
      return;
    }
    if (!categoryId) {
      setStatus({ type: "err", msg: "Pilih kategori dulu." });
      return;
    }

    setLoading(true);
    setStatus(null);

    let berhasil = 0;
    let gagal = 0;
    let kursor = 0;

    const kirimSatu = async (index: number) => {
      const file = files[index];
      if (!file) return;

      if (file.size > MAX_BYTES) {
        gagal += 1;
        setStatusFile(index, {
          status: "gagal",
          pesan: `Ukuran ${formatUkuran(file.size)} melebihi batas 8MB`,
        });
        return;
      }

      setStatusFile(index, { status: "mengunggah" });

      const body = new FormData();
      body.append("file", file);
      body.append("categoryId", categoryId);
      if (programId) body.append("programId", programId);
      // Caption wajib 2 karakter: pakai nama file sebagai cadangan bila kosong.
      body.append("caption", caption || file.name.replace(/\.[^.]+$/, ""));
      body.append("alt", alt);

      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          gagal += 1;
          setStatusFile(index, {
            status: "gagal",
            pesan: data.error ?? "Upload gagal.",
          });
          return;
        }
        berhasil += 1;
        setStatusFile(index, { status: "berhasil", pesan: undefined });
      } catch {
        gagal += 1;
        setStatusFile(index, { status: "gagal", pesan: "Jaringan bermasalah." });
      }
    };

    // Antrean paralel terbatas (KONKURENSI) agar server tidak kebanjiran.
    const pekerja = Array.from(
      { length: Math.min(KONKURENSI, files.length) },
      async () => {
        while (kursor < files.length) {
          const milikSaya = kursor++;
          await kirimSatu(milikSaya);
        }
      }
    );
    await Promise.all(pekerja);

    setStatus({
      type: gagal === 0 ? "ok" : "err",
      msg:
        `${berhasil} foto berhasil diunggah` +
        (gagal > 0 ? `, ${gagal} gagal (lihat daftar di bawah).` : ".") +
        (gagal > 0 ? " Untuk yang gagal: perbaiki lalu pilih ulang fotonya." : ""),
    });
    setLoading(false);
    if (berhasil > 0) {
      setFiles([]);
      setInputKey((k) => k + 1);
      router.refresh();
    }
  }


  const inputCls =
    "w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue";
  const labelCls = "block text-xs font-bold text-navy mb-1.5";

  const badgePerStatus: Record<AntreanStatus, string> = {
    menunggu: "bg-gray-100 text-gray-600",
    mengunggah: "bg-blue-100 text-blue-800",
    berhasil: "bg-green-100 text-green-800",
    gagal: "bg-red-100 text-red-700",
  };
  const labelPerStatus: Record<AntreanStatus, string> = {
    menunggu: "Menunggu",
    mengunggah: "Mengunggah…",
    berhasil: "Berhasil",
    gagal: "Gagal",
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-line p-6 space-y-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-navy">
          Upload Foto
        </h2>
        <span className="text-xs text-mist">
          Bisa banyak foto sekaligus (maks {MAX_FILES} per batch)
        </span>
      </div>

      <div>
        <label htmlFor="file" className={labelCls}>
          Foto — boleh pilih beberapa (JPG/PNG/WebP/AVIF, maks 8MB per foto,
          otomatis dikompres)
        </label>
        <input
          key={inputKey}
          id="file"
          name="file"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => {
            tambahFile(e.target.files);
            // Reset nilai input agar memilih file yang sama tetap terdeteksi,
            // tanpa menghapus antrean yang sudah ditambahkan.
            e.target.value = "";
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue"
        />
      </div>

      {antrean.length > 0 && (
        <div className="rounded-xl border border-line bg-paper p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-navy">
              Antrean ({antrean.length} foto)
            </p>
            <button
              type="button"
              onClick={bersihkan}
              disabled={loading}
              className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
            >
              Bersihkan daftar
            </button>
          </div>
          <ul className="space-y-1.5 max-h-56 overflow-y-auto">
            {antrean.map((f, i) => (
              <li
                key={`${f.nama}-${i}`}
                className="flex items-center gap-2 rounded-lg bg-white border border-line px-2.5 py-1.5"
              >
                <span className="text-xs text-ink truncate flex-1" title={f.nama}>
                  {f.nama}
                </span>
                <span className="text-xs text-mist whitespace-nowrap">
                  {formatUkuran(f.ukuran)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${badgePerStatus[f.status]}`}
                  title={f.pesan}
                >
                  {f.pesan ?? labelPerStatus[f.status]}
                </span>
                <button
                  type="button"
                  onClick={() => hapusDariAntrean(i)}
                  disabled={loading}
                  aria-label={`Hapus ${f.nama} dari antrean`}
                  className="text-xs font-bold text-red-600 hover:underline disabled:opacity-40"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className={labelCls}>
            Kategori (wajib)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Pilih Kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="programId" className={labelCls}>
            Program (opsional)
          </label>
          <select id="programId" name="programId" className={inputCls}>
            <option value="">— Tanpa program —</option>
            {programRelevan.map((p) => (
              <option key={p.id} value={p.id}>
                {p.judul}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-mist">
            Untuk filter galeri publik. Pilihan mengikuti kategori di samping.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="caption" className={labelCls}>
            Caption (berlaku untuk semua foto di batch ini)
          </label>
          <input
            id="caption"
            name="caption"
            required
            minLength={2}
            maxLength={200}
            placeholder="Mis. Sesi Praktik Kelas Barista"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-mist">
            Caption per foto bisa dikoreksi lewat tombol <strong>Edit</strong> di
            daftar bawah setelah terunggah.
          </p>
        </div>
        <div>
          <label htmlFor="alt" className={labelCls}>
            Alt teks (opsional, untuk aksesibilitas)
          </label>
          <input
            id="alt"
            name="alt"
            maxLength={300}
            placeholder="Deskripsi singkat foto"
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || files.length === 0}
        className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
      >
        {loading
          ? `Mengunggah ${antrean.length} foto...`
          : files.length > 0
            ? `Unggah ${files.length} Foto`
            : "Unggah Foto"}
      </button>

      {status && (
        <p
          role="status"
          className={`text-sm font-semibold ${
            status.type === "ok" ? "text-blue" : "text-red-600"
          }`}
        >
          {status.msg}
        </p>
      )}
    </form>
  );
}