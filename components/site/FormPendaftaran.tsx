"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Data jadwal yang dibutuhkan modal pendaftaran (dikirim dari server component). */
export type PendaftaranTarget = {
  jadwalId: number;
  programJudul: string;
  /** "Rabu, 30 Sep 2026" atau "Setiap Senin" untuk jadwal mingguan lama. */
  jadwalLabel: string;
  /** "08:00 - 16:00 WIB". */
  jamLabel: string;
  ruangan?: string | null;
  /** Tautan WhatsApp alternatif (pesan sudah terisi otomatis). */
  waUrl: string;
};

type State =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "success" };

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:outline-none focus:border-blue";
const labelCls = "block text-xs font-bold text-navy mb-1.5";

/**
 * Tombol "Daftar" + modal formulir pendaftaran (client component).
 * Dipakai di tabel jadwal publik: /program/[slug], /kelas/[slug], dan landing.
 * Kirim → POST /api/pendaftaran → simpan DB → notifikasi email admin.
 */
export default function FormPendaftaran({
  target,
  size = "sm",
  disabled = false,
}: {
  target: PendaftaranTarget;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ type: "idle" });
  const [namaDepan, setNamaDepan] = useState("");
  // Portal hanya dirender di client (setelah mount) agar aman saat SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function close() {
    setOpen(false);
    setState({ type: "idle" });
  }

  // Escape menutup modal + kunci scroll body selama modal terbuka.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setState({ type: "idle" });
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState({ type: "loading" });

    try {
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jadwalId: target.jadwalId,
          nama: fd.get("nama"),
          wa: fd.get("wa"),
          email: fd.get("email"),
          catatan: fd.get("catatan"),
          website: fd.get("website"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setState({
          type: "error",
          message:
            data.error ??
            "Pendaftaran gagal dikirim. Coba lagi atau hubungi kami via WhatsApp.",
        });
        return;
      }
      setNamaDepan(String(fd.get("nama") ?? "").trim().split(" ")[0] ?? "");
      form.reset();
      setState({ type: "success" });
    } catch {
      setState({
        type: "error",
        message:
          "Jaringan bermasalah. Coba lagi atau hubungi kami via WhatsApp.",
      });
    }
  }

  if (disabled) {
    return (
      <span className="inline-block rounded-full bg-paper border border-line px-3.5 py-2 text-xs font-bold text-mist">
        Penuh
      </span>
    );
  }

  const btnCls =
    size === "md"
      ? "btn btn-primary"
      : "inline-block rounded-full bg-gold text-navy text-xs font-bold px-3.5 py-2 hover:-translate-y-0.5 transition";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnCls}>
        Daftar →
      </button>
      {/* Portal ke <body>: ancestor .reveal memakai transform, yang membuat
          position: fixed menjadi relatif terhadapnya (modal menimpa tabel). */}
      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(22,33,74,0.55)] p-4 sm:items-center"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`daftar-title-${target.jadwalId}`}
            className="my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_-25px_rgba(22,33,74,0.6)]"
          >
            {state.type === "success" ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                  ✓
                </div>
                <h3
                  id={`daftar-title-${target.jadwalId}`}
                  className="font-display text-xl font-semibold text-navy"
                >
                  Pendaftaran Anda diterima!
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  Terima kasih{namaDepan ? `, ${namaDepan}` : ""}. Kami mencatat
                  pendaftaran Anda untuk{" "}
                  <strong className="text-ink">{target.programJudul}</strong> —{" "}
                  {target.jadwalLabel}, {target.jamLabel}. Admin akan menghubungi
                  Anda via WhatsApp untuk konfirmasi kursi dan biaya.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <a
                    href={target.waUrl}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary"
                  >
                    Chat WhatsApp
                  </a>
                  <button type="button" onClick={close} className="btn btn-ghost">
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      id={`daftar-title-${target.jadwalId}`}
                      className="font-display text-xl font-semibold text-navy"
                    >
                      Formulir Pendaftaran
                    </h3>
                    <p className="mt-0.5 text-xs text-mist">
                      {target.programJudul} · {target.jadwalLabel} · {target.jamLabel}
                      {target.ruangan ? ` · ${target.ruangan}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Tutup formulir"
                    className="text-2xl leading-none text-mist hover:text-navy"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`nama-${target.jadwalId}`} className={labelCls}>
                      Nama lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`nama-${target.jadwalId}`}
                      name="nama"
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Mis. Rani Putri"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor={`wa-${target.jadwalId}`} className={labelCls}>
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`wa-${target.jadwalId}`}
                      name="wa"
                      required
                      minLength={9}
                      maxLength={20}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      className={inputCls}
                    />
                    <p className="mt-1 text-[11px] text-mist">
                      Dipakai admin untuk konfirmasi kursi.
                    </p>
                  </div>
                  <div>
                    <label htmlFor={`email-${target.jadwalId}`} className={labelCls}>
                      Email <span className="font-semibold text-mist">(opsional)</span>
                    </label>
                    <input
                      id={`email-${target.jadwalId}`}
                      name="email"
                      type="email"
                      maxLength={200}
                      autoComplete="email"
                      placeholder="nama@email.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor={`catatan-${target.jadwalId}`} className={labelCls}>
                      Catatan <span className="font-semibold text-mist">(opsional)</span>
                    </label>
                    <textarea
                      id={`catatan-${target.jadwalId}`}
                      name="catatan"
                      rows={3}
                      maxLength={500}
                      placeholder="Mis. butuh info biaya & syarat pendaftaran"
                      className={inputCls}
                    />
                  </div>
                </div>
                {/* Honeypot anti-bot: wajib kosong & tidak terlihat pengguna */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor={`website-${target.jadwalId}`}>Website</label>
                  <input
                    id={`website-${target.jadwalId}`}
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {state.type === "error" && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    {state.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state.type === "loading"}
                  className="btn btn-primary w-full justify-center disabled:opacity-70"
                >
                  {state.type === "loading" ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>

                <p className="text-center text-xs text-mist">
                  Belum siap daftar?{" "}
                  <a
                    href={target.waUrl}
                    target="_blank"
                    rel="noopener"
                    className="font-bold text-blue hover:underline"
                  >
                    Tanya dulu via WhatsApp →
                  </a>
                </p>
                <p className="text-center text-[11px] leading-relaxed text-mist">
                  Data hanya digunakan untuk keperluan pendaftaran pelatihan.
                </p>
              </form>
            )}
          </div>
        </div>,
            document.body
          )}

    </>
  );
}
