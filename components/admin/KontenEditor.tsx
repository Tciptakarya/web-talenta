"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { saveContentAction, resetContentAction } from "@/app/admin/actions";
import type { ActionState } from "@/app/admin/actions";
import { CONTENT_SECTIONS, textOf, type ContentMap } from "@/lib/siteContent";

/**
 * Editor teks website publik.
 *
 * Satu form untuk seluruh bagian, dikelompokkan lewat <details> supaya
 * tidak memanjang. Nilai bawaan ditampilkan sebagai petunjuk; mengosongkan
 * sebuah field berarti "pakai nilai bawaan" (nilainya tidak disimpan).
 */
export default function KontenEditor({ current }: { current: ContentMap }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(saveContentAction, undefined);
  const [resetState, resetFormAction, resetPending] = useActionState(
    resetContentAction,
    undefined
  );
  const [open, setOpen] = useState<string | null>(CONTENT_SECTIONS[0]?.id ?? null);
  const [resetKey, setResetKey] = useState<string | null>(null);

  const totalTersimpan = CONTENT_SECTIONS.reduce(
    (n, s) => n + s.fields.filter((f) => current[f.key] !== undefined).length,
    0
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">
          {totalTersimpan > 0
            ? `${totalTersimpan} teks sedang diubah dari nilai bawaan.`
            : "Semua teks masih memakai nilai bawaan (isi di website saat ini)."}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1B2A5E] disabled:opacity-50"
        >
          {pending ? "Menyimpan…" : "Simpan Semua Perubahan"}
        </button>
      </div>

      {state?.ok && (
        <p className="rounded-lg border border-[#BFE3C6] bg-[#F1FBF3] px-4 py-2.5 text-sm text-[#1E6B3A]">
          {state.message} Halaman publik sudah diperbarui.
        </p>
      )}
      {state && !state.ok && (
        <p className="rounded-lg border border-[#F0C4C4] bg-[#FDF3F3] px-4 py-2.5 text-sm text-[#9B2C2C]">
          {state.error}
        </p>
      )}
      {resetState?.ok && (
        <p className="rounded-lg border border-[#BFE3C6] bg-[#F1FBF3] px-4 py-2.5 text-sm text-[#1E6B3A]">
          {resetState.message}
        </p>
      )}

      {CONTENT_SECTIONS.map((section) => {
        const changed = section.fields.filter((f) => current[f.key] !== undefined).length;
        const isOpen = open === section.id;
        return (
          <details
            key={section.id}
            open={isOpen}
            onToggle={(e) => setOpen((e.currentTarget.open ? section.id : null))}
            className="rounded-xl border border-line bg-white"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4">
              <span>
                <span className="font-semibold">{section.title}</span>
                <span className="mt-0.5 block text-xs text-mist">{section.description}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {changed > 0 && (
                  <span className="rounded-full bg-[#EEF1F8] px-2 py-0.5 text-[10px] font-semibold text-[#3A4A75]">
                    {changed} diubah
                  </span>
                )}
                <span className="text-xs text-mist">{isOpen ? "Tutup" : "Buka"}</span>
              </span>
            </summary>

            <div className="flex flex-col gap-4 border-t border-line px-5 py-4">
              {section.fields.map((f) => {
                // Tampilkan teks yang SEDANG tampil di publik: nilai tersimpan bila ada, kalau tidak nilai bawaan.
                const value = textOf(current, f.key);
                const diubah = current[f.key] !== undefined;
                return (
                  <label key={f.key} className="grid gap-1.5">
                    <span className="flex items-center gap-2 text-xs font-semibold text-ink">
                      {f.label}
                      {diubah && (
                        <span className="rounded-full bg-[#E7F0FF] px-2 py-0.5 text-[10px] font-semibold text-[#2C4A9E]">
                          diubah
                        </span>
                      )}
                    </span>
                    {f.hint && <span className="text-[11px] text-mist">{f.hint}</span>}
                    {f.multiline ? (
                      <textarea
                        name={f.key}
                        defaultValue={value}
                        rows={f.rows ?? 3}
                        placeholder={f.defaultValue}
                        className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
                      />
                    ) : (
                      <input
                        type="text"
                        name={f.key}
                        defaultValue={value}
                        placeholder={f.defaultValue}
                        className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
                      />
                    )}
                    {diubah && (
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                            `[name="${CSS.escape(f.key)}"]`
                          );
                          if (el) el.value = "";
                          setResetKey(f.key);
                        }}
                        className="self-start text-[11px] font-semibold text-mist underline hover:text-ink"
                      >
                        Kembalikan ke bawaan
                      </button>
                    )}
                  </label>
                );
              })}
            </div>
          </details>
        );
      })}

      {/* Form terpisah untuk reset: tidak ikut terkirim saat "Simpan Semua". */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <p className="text-xs text-mist">
          Kembalikan satu teks ke nilai bawaan (langsung berlaku, tidak perlu simpan).
        </p>
        <button
          type="button"
          disabled={!resetKey || resetPending}
          onClick={() => {
            if (!resetKey) return;
            const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
              `[name="${CSS.escape(resetKey)}"]`
            );
            if (el) el.value = "";
            const fd = new FormData();
            fd.set("key", resetKey);
            resetFormAction(fd);
            setResetKey(null);
            router.refresh();
          }}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-paper-alt disabled:opacity-50"
        >
          {resetPending ? "Mengembalikan…" : "Kembalikan teks yang dipilih"}
        </button>
      </div>
    </form>
  );
}
