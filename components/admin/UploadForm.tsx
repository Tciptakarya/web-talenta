"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UploadFormProps = {
  categories: { id: number; name: string }[];
};

/** Form upload foto galeri → POST /api/upload (kompres sharp → Blob/local). */
export default function UploadForm({ categories }: UploadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;

    if (!fileInput.files?.length) {
      setStatus({ type: "err", msg: "Pilih foto dulu." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const fd = new FormData(form);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus({ type: "err", msg: data.error ?? "Upload gagal." });
        return;
      }

      setStatus({ type: "ok", msg: "Foto berhasil diupload dan tampil di galeri." });
      form.reset();
      router.refresh();
    } catch {
      setStatus({ type: "err", msg: "Jaringan bermasalah, coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-line p-6 space-y-4"
    >
      <h2 className="font-display text-xl font-semibold text-navy">Upload Foto</h2>

      <div>
        <label htmlFor="file" className="block text-xs font-bold text-navy mb-1.5">
          Foto (JPG/PNG/WebP/AVIF, maks 8MB — otomatis dikompres)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-xs font-bold text-navy mb-1.5">
            Kategori (wajib)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
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
          <label htmlFor="caption" className="block text-xs font-bold text-navy mb-1.5">
            Caption
          </label>
          <input
            id="caption"
            name="caption"
            required
            minLength={2}
            maxLength={200}
            placeholder="Mis. Sesi Praktik Kelas Barista"
            className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
          />
        </div>
      </div>

      <div>
        <label htmlFor="alt" className="block text-xs font-bold text-navy mb-1.5">
          Alt teks (opsional, untuk aksesibilitas)
        </label>
        <input
          id="alt"
          name="alt"
          maxLength={300}
          placeholder="Deskripsi singkat foto"
          className="w-full rounded-xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-sm focus:outline-none focus:border-blue"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
      >
        {loading ? "Mengupload..." : "Upload Foto"}
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