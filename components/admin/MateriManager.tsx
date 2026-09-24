"use client";

import { useState, useActionState } from "react";
import {
  createMateri,
  updateMateri,
  deleteMateri,
  type ActionState,
} from "@/app/admin/actions";
import { MATERI_TIPE_LIST } from "@/lib/schemas";

export type ProgramOption = { id: number; judul: string };

export type AdminMateri = {
  id: number;
  programId: number;
  judul: string;
  tipe: string;
  fileUrl: string | null;
  linkUrl: string | null;
  urutan: number;
  isActive: boolean;
  program: { id: number; judul: string };
};

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-paper px-3 py-2 text-sm focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1.5";

/** Badge warna per tipe — mengikuti screenshot sistem lama (+ varian dark). */
const TIPE_BADGE: Record<string, string> = {
  VIDEO:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30",
  "MODUL CETAK":
    "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-400/30",
  PDF: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/30",
  SLIDE:
    "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/30",
};

function TipeBadge({ tipe }: { tipe: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${
        TIPE_BADGE[tipe] ?? "bg-paper text-mist border-line"
      }`}
    >
      {tipe}
    </span>
  );
}

function ProgramSelect({
  programs,
  defaultValue,
  id,
}: {
  programs: ProgramOption[];
  defaultValue?: number;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        Program Kursus
      </label>
      <select
        id={id}
        name="programId"
        required
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        <option value="">— Pilih Program —</option>
        {programs.map((p) => (
          <option key={p.id} value={p.id}>
            {p.judul}
          </option>
        ))}
      </select>
    </div>
  );
}

function TipeSelect({ defaultValue, id }: { defaultValue?: string; id: string }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        Tipe Materi
      </label>
      <select
        id={id}
        name="tipe"
        required
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      >
        <option value="">— Pilih Tipe —</option>
        {MATERI_TIPE_LIST.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

function MateriEditRow({
  materi,
  programs,
  onDone,
}: {
  materi: AdminMateri;
  programs: ProgramOption[];
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    updateMateri,
    undefined
  );

  return (
    <tr>
      <td colSpan={6} className="bg-paper px-4 py-4">
        <form action={action} className="space-y-3">
          <input type="hidden" name="id" value={materi.id} />
          <input type="hidden" name="fileUrl" value={materi.fileUrl ?? ""} />

          <div className="grid sm:grid-cols-2 gap-3">
            <ProgramSelect
              id={`edit-program-${materi.id}`}
              programs={programs}
              defaultValue={materi.programId}
            />
            <div>
              <label htmlFor={`edit-judul-${materi.id}`} className={labelCls}>
                Judul Materi
              </label>
              <input
                id={`edit-judul-${materi.id}`}
                name="judul"
                defaultValue={materi.judul}
                required
                minLength={3}
                maxLength={150}
                className={inputCls}
              />
            </div>
            <TipeSelect id={`edit-tipe-${materi.id}`} defaultValue={materi.tipe} />
            <div>
              <label htmlFor={`edit-linkUrl-${materi.id}`} className={labelCls}>
                Link URL (opsional jika upload file)
              </label>
              <input
                id={`edit-linkUrl-${materi.id}`}
                name="linkUrl"
                type="url"
                defaultValue={materi.linkUrl ?? ""}
                maxLength={500}
                placeholder="https://youtube.com/... atau https://drive.google.com/..."
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={`edit-file-${materi.id}`} className={labelCls}>
                Ganti File (opsional)
              </label>
              <input
                id={`edit-file-${materi.id}`}
                name="file"
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp4"
                className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-blue"
              />
              {materi.fileUrl && (
                <a
                  href={materi.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue hover:underline mt-1 inline-block"
                >
                  File saat ini: Unduh Berkas
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={materi.isActive}
                className="rounded border-line"
              />
              <span className="font-semibold text-navy">Aktif (dapat diunduh peserta)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-navy">Urutan</span>
              <input
                name="urutan"
                type="number"
                defaultValue={materi.urutan}
                min={0}
                max={999}
                className="w-20 rounded-xl border-[1.5px] border-line bg-paper px-3 py-1.5 text-sm text-center focus:outline-none focus:border-blue"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-70"
            >
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="rounded-full border border-line bg-white font-bold px-5 py-2 text-sm text-navy hover:bg-paper"
            >
              Batal
            </button>
            {state?.error && (
              <p className="text-sm font-semibold text-red-600">{state.error}</p>
            )}
            {state?.ok && (
              <p className="text-sm font-semibold text-blue">{state.message}</p>
            )}
          </div>
        </form>
      </td>
    </tr>
  );
}

function MateriRow({
  materi,
  index,
  programs,
}: {
  materi: AdminMateri;
  index: number;
  programs: ProgramOption[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <tr className="border-b border-line last:border-0 align-top">
        <td className="px-4 py-3 text-sm text-mist">{index}</td>
        <td className="px-4 py-3">
          <p className="text-sm font-bold text-navy">{materi.program.judul}</p>
          {!materi.isActive && (
            <span className="text-xs font-semibold text-red-600">Nonaktif</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm font-semibold text-ink">{materi.judul}</td>
        <td className="px-4 py-3">
          <TipeBadge tipe={materi.tipe} />
        </td>
        <td className="px-4 py-3">
          {materi.linkUrl ? (
            <a
              href={materi.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-blue hover:underline"
            >
              ↗ Buka Link
            </a>
          ) : materi.fileUrl ? (
            <a
              href={materi.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-blue hover:underline"
            >
              📄 Unduh Berkas
            </a>
          ) : (
            <span className="text-sm text-mist">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white w-8 h-8 grid place-items-center transition"
              aria-label={`Ubah materi ${materi.judul}`}
            >
              ✏️
            </button>
            <form action={deleteMateri} className="inline">
              <input type="hidden" name="id" value={materi.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm(`Hapus materi "${materi.judul}"?`)) e.preventDefault();
                }}
                className="rounded-lg bg-red-500 hover:bg-red-600 text-white w-8 h-8 grid place-items-center transition"
                aria-label={`Hapus materi ${materi.judul}`}
              >
                🗑️
              </button>
            </form>
          </div>
        </td>
      </tr>
      {editing && (
        <MateriEditRow
          materi={materi}
          programs={programs}
          onDone={() => setEditing(false)}
        />
      )}
    </>
  );
}

export default function MateriManager({
  materi,
  programs,
}: {
  materi: AdminMateri[];
  programs: ProgramOption[];
}) {
  const [createState, createAction, createPending] = useActionState<
    ActionState | undefined,
    FormData
  >(createMateri, undefined);

  return (
    <div className="space-y-6">
      {/* Form Tambah Materi */}
      <form
        action={createAction}
        className="rounded-2xl bg-white border border-line p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-navy">
            Tambah Materi Baru
          </h2>
          <span className="text-xs text-mist">
            Upload file ATAU isi Link URL — salah satu wajib
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ProgramSelect id="new-program" programs={programs} />
          <TipeSelect id="new-tipe" />
          <div>
            <label htmlFor="new-judul" className={labelCls}>
              Judul Materi
            </label>
            <input
              id="new-judul"
              name="judul"
              required
              minLength={3}
              maxLength={150}
              placeholder="Contoh: Video Teknik Manual Brew"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="new-linkUrl" className={labelCls}>
              Link URL (opsional jika upload file)
            </label>
            <input
              id="new-linkUrl"
              name="linkUrl"
              type="url"
              maxLength={500}
              placeholder="https://youtube.com/... atau https://drive.google.com/..."
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="new-file" className={labelCls}>
              File Materi (PDF/Word/PowerPoint/JPG/PNG/MP4, maks 10MB — untuk file
              besar gunakan Link URL)
            </label>
            <input
              id="new-file"
              name="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp4"
              className="block w-full text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={true}
              className="rounded border-line"
            />
            <span className="font-semibold text-navy">Aktif (dapat diunduh peserta)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-navy">Urutan</span>
            <input
              name="urutan"
              type="number"
              defaultValue={0}
              min={0}
              max={999}
              className="w-20 rounded-xl border-[1.5px] border-line bg-paper px-3 py-1.5 text-sm text-center focus:outline-none focus:border-blue"
            />
          </label>
          <button
            type="submit"
            disabled={createPending}
            className="rounded-full bg-navy text-white font-bold px-6 py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-70"
          >
            {createPending ? "Menambah..." : "Tambah Materi"}
          </button>
          {createState?.error && (
            <p className="text-sm font-semibold text-red-600">{createState.error}</p>
          )}
          {createState?.ok && (
            <p className="text-sm font-semibold text-blue">{createState.message}</p>
          )}
        </div>
      </form>

      {/* Tabel Materi */}
      <div className="rounded-2xl bg-white border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-xs font-bold text-navy">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Program Kursus</th>
              <th className="px-4 py-3">Judul Materi</th>
              <th className="px-4 py-3">Tipe Materi</th>
              <th className="px-4 py-3">File / Link URL</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {materi.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-mist text-center">
                  Belum ada materi pelatihan. Tambahkan lewat form di atas.
                </td>
              </tr>
            ) : (
              materi.map((m, i) => (
                <MateriRow key={m.id} materi={m} index={i + 1} programs={programs} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
