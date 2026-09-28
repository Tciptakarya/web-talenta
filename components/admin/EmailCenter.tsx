"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  deleteEmailAction,
  saveDraftAction,
  sendEmailAction,
  setEmailReadAction,
  syncEmailInboxAction,
} from "@/app/admin/actions";
import type { ActionState } from "@/app/admin/actions";

export type EmailRow = {
  id: number;
  direction: string;
  status: string;
  subject: string;
  fromName: string | null;
  fromEmail: string;
  to: string;
  preview: string | null;
  isRead: boolean;
  hasAttachments: boolean;
  date: string;
};

export type EmailDetail = {
  id: number;
  direction: string;
  status: string;
  subject: string;
  fromName: string | null;
  fromEmail: string;
  to: string;
  cc: string;
  bcc: string;
  date: string;
  preview: string | null;
  textBody: string | null;
  /** SUDAH disanitasi di server — aman untuk dangerouslySetInnerHTML */
  safeHtml: string | null;
  isRead: boolean;
  resendId: string | null;
  errorMessage: string | null;
  /** true bila boleh dihapus permanen (keluar & draft). */
  canDelete: boolean;
  /** true bila email masuk → hanya disembunyikan, bukan dihapus dari mailbox. */
  isHidden: boolean;
  attachments: {
    id: number;
    filename: string;
    mimeType: string;
    size: number;
    isInline: boolean;
  }[];
};

const TZ = "Asia/Jakarta";

function waktu(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function ukuran(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_LABEL: Record<string, string> = {
  sent: "Terkirim",
  delivered: "Diterima",
  bounced: "Ditolak (bounce)",
  failed: "Gagal",
  skipped: "Dilewati",
  received: "Diterima",
  draft: "Draft",
};

const card = "rounded-xl border border-line bg-white";
const btn =
  "rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:opacity-50";
const btnGhost = `${btn} border border-line text-ink hover:bg-paper-alt`;
const btnNavy = `${btn} bg-navy text-white hover:bg-[#1B2A5E]`;
const btnDanger = `${btn} border border-[#E6B9B9] text-[#9B2C2C] hover:bg-[#FDF3F3]`;

/**
 * Sorot kata kunci pencarian di dalam teks. Sengaja memakai elemen React
 * (`<mark>`), bukan `dangerouslySetInnerHTML`, sehingga teks email dari
 * internet tidak pernah masuk HTML mentah.
 */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const bersih = terms.filter((t) => t.length > 1);
  if (bersih.length === 0) return <>{text}</>;
  const pola = new RegExp(
    `(${bersih.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const bagian = text.split(pola);
  return (
    <>
      {bagian.map((b, i) =>
        bersih.some((t) => t.toLowerCase() === b.toLowerCase()) ? (
          <mark key={i} className="rounded bg-[#FFF1B8] px-0.5 text-inherit dark:bg-[#5A4A12]">
            {b}
          </mark>
        ) : (
          <span key={i}>{b}</span>
        )
      )}
    </>
  );
}

export default function EmailCenter({
  tab,
  q,
  terms,
  filter,
  page,
  inbox,
  sent,
  drafts,
  selected,
  unreadTotal,
  imapConfigured,
  mailto,
  fromLabel,
  fromWarning,
}: {
  tab: string;
  q: string;
  terms: string[];
  filter: string;
  page: number;
  inbox: { items: EmailRow[]; total: number; hasNext: boolean };
  sent: { items: EmailRow[]; total: number; hasNext: boolean };
  drafts: { items: EmailRow[]; total: number; hasNext: boolean };
  selected: EmailDetail | null;
  unreadTotal: number;
  imapConfigured: boolean;
  mailto: string;
  fromLabel: string;
  fromWarning: string | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(q);
  const [isPending, startTransition] = useTransition();
  const [syncMsg, setSyncMsg] = useState<{ ok: boolean; message?: string } | null>(null);
  const [readState, setReadState] = useState<ActionState | undefined>(undefined);
  const [mode, setMode] = useState<"compose" | "reply" | "forward" | null>(
    tab === "compose" ? "compose" : null
  );
  const [sendState, sendFormAction] = useActionState(sendEmailAction, undefined);
  const [draftState, draftFormAction] = useActionState(saveDraftAction, undefined);
  const [deleteState, deleteFormAction] = useActionState(deleteEmailAction, undefined);
  const [hapusId, setHapusId] = useState<number | null>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  // Draft yang sedang diedit (isi form diambil dari detail draft).
  const draftBeingEdited = selected && selected.direction === "draft" ? selected : null;

  // Detail dibuka → tandai sudah dibaca (hanya untuk email masuk & belum dibaca).
  useEffect(() => {
    if (selected && selected.direction === "inbound" && !selected.isRead) {
      const fd = new FormData();
      fd.set("id", String(selected.id));
      fd.set("isRead", "true");
      setEmailReadAction(readState, fd).then((s) => {
        setReadState(s);
        router.refresh();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  // Setelah kirim sukses → tutup form, tampilkan konfirmasi, refresh daftar.
  useEffect(() => {
    if (sendState?.ok) {
      setMode(null);
      setFileNames([]);
      if (filesRef.current) filesRef.current.value = "";
      setSyncMsg({ ok: true, message: sendState.message ?? "Email berhasil dikirim." });
      router.push("/admin/email?tab=sent");
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendState]);

  // Draft tersimpan → beri tahu & arahkan ke tab Draft.
  useEffect(() => {
    if (draftState?.ok) {
      setSyncMsg({ ok: true, message: draftState.message ?? "Draft tersimpan." });
      router.push("/admin/email?tab=draft");
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftState]);

  // Email dihapus → tutup detail, perbarui daftar.
  useEffect(() => {
    if (deleteState?.ok) {
      setHapusId(null);
      setSyncMsg({ ok: true, message: deleteState.message ?? "Email dihapus." });
      router.push(qs({ email: undefined }));
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteState]);

  const qs = (patch: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) {
        sp.delete(k);
      } else if (k === "page" && v === 1) {
        // Halaman 1 = default → tidak perlu di URL.
        sp.delete(k);
      } else {
        sp.set(k, String(v));
      }
    }
    const s = sp.toString();
    return `/admin/email${s ? `?${s}` : ""}`;
  };

  const list = tab === "sent" ? sent : tab === "draft" ? drafts : inbox;
  const filters =
    tab === "sent"
      ? [
          { key: "all", label: "Semua" },
          { key: "ok", label: "Berhasil" },
          { key: "fail", label: "Gagal" },
        ]
      : tab === "draft"
        ? [{ key: "all", label: "Semua" }]
        : [
            { key: "all", label: "Semua" },
            { key: "unread", label: "Belum Dibaca" },
            { key: "read", label: "Sudah Dibaca" },
          ];

  const onSync = () => {
    startTransition(async () => {
      const res = await syncEmailInboxAction();
      setSyncMsg({ ok: res.ok, message: res.message });
      router.refresh();
    });
  };

  const toggleRead = (id: number, next: boolean) => {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("isRead", String(next));
    setEmailReadAction(readState, fd).then((s) => {
      setReadState(s);
      router.refresh();
    });
  };

  // Mode form berasal dari state (reply/forward/compose) ATAU dari URL
  // `?tab=compose` — navigasi client-side tidak selalu remount komponen,
  // jadi `useState` awal saja tidak cukup. Membuka draft juga langsung
  // menampilkan form berisi isinya.
  const formMode =
    mode ?? (tab === "compose" ? "compose" : draftBeingEdited ? "compose" : null);
  const formTitle =
    formMode === "reply"
      ? "Balas Email"
      : formMode === "forward"
        ? "Teruskan Email"
        : draftBeingEdited
          ? "Edit Draft"
          : "Tulis Email";
  // Sumber nilai default form: draft yang dibuka, atau email yang dibalas.
  const sumber = draftBeingEdited ?? selected;

  return (
    <div className="flex flex-col gap-5">
      {/* Kepala halaman */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Email</h1>
          <p className="mt-1 text-sm text-mist">
            {mailto}
            {unreadTotal > 0 ? ` · ${unreadTotal} belum dibaca` : " · semua email sudah dibaca"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onSync} disabled={isPending || !imapConfigured} className={btnGhost}>
            {isPending ? "Mengambil…" : "↻ Refresh"}
          </button>
          <Link href={qs({ tab: "compose", email: undefined, page: undefined })} className={btnNavy}>
            Tulis Email
          </Link>
        </div>
      </div>

      {!imapConfigured && (
        <p className="rounded-lg border border-[#F0D9A8] bg-[#FDF6E6] px-4 py-3 text-sm text-[#7A5A12]">
          Email masuk belum aktif. Email keluar (Tulis/Balas) tetap bisa digunakan.
        </p>
      )}
      {syncMsg && (
        <p
          className={`rounded-lg border px-4 py-2.5 text-sm ${
            syncMsg.ok
              ? "border-[#BFE3C6] bg-[#F1FBF3] text-[#1E6B3A]"
              : "border-[#F0C4C4] bg-[#FDF3F3] text-[#9B2C2C]"
          }`}
        >
          {syncMsg.message}
        </p>
      )}

      {/* Tab + cari + filter */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "inbox", label: `Inbox${unreadTotal > 0 ? ` (${unreadTotal})` : ""}` },
          { key: "sent", label: "Terkirim" },
          { key: "draft", label: `Draft${drafts.total > 0 ? ` (${drafts.total})` : ""}` },
        ].map((t) => (
          <Link
            key={t.key}
            href={qs({ tab: t.key === "inbox" ? undefined : t.key, filter: undefined, page: undefined, email: undefined })}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-navy text-white"
                : "border border-line bg-white text-ink hover:bg-paper-alt"
            }`}
          >
            {t.label}
          </Link>
        ))}

        <form
          className="ml-auto flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(qs({ q: search, page: undefined, email: undefined }));
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari email… (mis. deployment vercel)"
            aria-label="Cari email"
            title="Pencarian: semua kata harus cocok · operator: from: · to: · subjek: · dengan:lampiran"
            className="w-72 rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-[#2C4A9E]"
          />
          <button type="submit" className={btnGhost}>
            Cari
          </button>
        </form>
      </div>

      {q && (
        <p className="-mt-3 text-xs text-mist">
          {list.total} hasil untuk <span className="font-semibold text-ink">{q}</span>
          {terms.length > 1 ? " (semua kata harus cocok)" : ""} · bisa pakai
          operator <code className="rounded bg-paper-alt px-1">from:</code>,{" "}
          <code className="rounded bg-paper-alt px-1">to:</code>,{" "}
          <code className="rounded bg-paper-alt px-1">subjek:</code>,{" "}
          <code className="rounded bg-paper-alt px-1">dengan:lampiran</code>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={qs({ filter: f.key === "all" ? undefined : f.key, page: undefined })}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === f.key
                ? "bg-navy text-white"
                : "border border-line bg-white text-mist hover:bg-paper-alt"
            }`}
          >
            {f.label}
          </Link>
        ))}
        <span className="ml-auto text-xs text-mist">
          {list.total} email
        </span>
      </div>

      {/* Form compose / reply / forward */}
      {formMode && (
        <form action={sendFormAction} className={`${card} p-5 flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{formTitle}</h2>
            <Link
              href={qs({ tab: undefined, email: undefined })}
              onClick={() => setMode(null)}
              className="text-sm text-mist hover:text-ink"
            >
              Batal
            </Link>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="text-xs font-semibold text-mist">From</span>
            <span className="rounded-lg border border-line bg-paper px-3 py-2 text-sm">{fromLabel}</span>
          </label>

          {fromWarning && (
            <p className="rounded-lg border border-[#F0D9A8] bg-[#FDF6E6] px-3 py-2 text-sm text-[#7A5A12]">
              {fromWarning}
            </p>
          )}

          <input type="hidden" name="mode" value={formMode === "reply" ? "reply" : "compose"} />
          {formMode === "reply" && selected && <input type="hidden" name="replyToId" value={selected.id} />}
          {draftBeingEdited && <input type="hidden" name="draftId" value={draftBeingEdited.id} />}

          <label className="grid gap-1 text-sm">
            <span className="text-xs font-semibold text-mist">To</span>
            <input
              name="to"
              defaultValue={
                draftBeingEdited
                  ? draftBeingEdited.to
                  : formMode === "reply" && selected
                    ? selected.fromEmail
                    : ""
              }
              readOnly={formMode === "reply"}
              placeholder="nama@contoh.com, nama2@contoh.com"
              className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E] read-only:bg-paper"
            />
          </label>

          {formMode === "compose" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold text-mist">Cc</span>
                <input
                  name="cc"
                  defaultValue={draftBeingEdited ? draftBeingEdited.cc : ""}
                  placeholder="opsional"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold text-mist">Bcc</span>
                <input
                  name="bcc"
                  defaultValue={draftBeingEdited ? draftBeingEdited.bcc : ""}
                  placeholder="opsional"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
                />
              </label>
            </div>
          )}

          <label className="grid gap-1 text-sm">
            <span className="text-xs font-semibold text-mist">Subject</span>
            <input
              name="subject"
              defaultValue={
                draftBeingEdited
                  ? draftBeingEdited.subject === "(tanpa subjek)"
                    ? ""
                    : draftBeingEdited.subject
                  : formMode === "reply" && selected?.subject
                    ? selected.subject
                    : ""
              }
              placeholder="Subjek email"
              className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-xs font-semibold text-mist">Message</span>
            <textarea
              name="body"
              defaultValue={draftBeingEdited ? (draftBeingEdited.textBody ?? "") : ""}
              rows={9}
              placeholder="Tulis isi email…"
              className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-[#2C4A9E]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label className={`${btnGhost} cursor-pointer`}>
              + Lampirkan
              <input
                ref={filesRef}
                type="file"
                name="attachments"
                multiple
                className="hidden"
                onChange={(e) =>
                  setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))
                }
              />
            </label>
            <span className="text-xs text-mist">
              Maks. 5 berkas, 8 MB per berkas
              {fileNames.length > 0 ? ` · ${fileNames.join(", ")}` : ""}
            </span>
            <div className="ml-auto flex items-center gap-2">
              {/* Simpan draft: tombol terpisah agar tidak perlu mengirim. */}
              <button type="submit" formAction={draftFormAction} className={btnGhost}>
                Simpan Draft
              </button>
              <button type="submit" formAction={sendFormAction} className={btnNavy}>
                Kirim Email
              </button>
            </div>
          </div>

          {sendState && !sendState.ok && (
            <p className="rounded-lg border border-[#F0C4C4] bg-[#FDF3F3] px-3 py-2 text-sm text-[#9B2C2C]">
              {sendState.error}
            </p>
          )}
          {draftState && !draftState.ok && (
            <p className="rounded-lg border border-[#F0C4C4] bg-[#FDF3F3] px-3 py-2 text-sm text-[#9B2C2C]">
              {draftState.error}
            </p>
          )}
          {draftState?.ok && (
            <p className="rounded-lg border border-[#BFE3C6] bg-[#F1FBF3] px-3 py-2 text-sm text-[#1E6B3A]">
              {draftState.message}
            </p>
          )}
        </form>
      )}

      {/* Daftar + detail */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className={`${card} overflow-hidden`}>
          {list.items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-mist">
              {tab === "sent"
                ? "Belum ada email terkirim."
                : tab === "draft"
                  ? "Belum ada draft."
                  : q
                    ? "Tidak ada email yang cocok."
                    : "Belum ada email."}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {list.items.map((e) => {
                const aktif = selected?.id === e.id;
                return (
                  <li key={e.id}>
                    <Link
                      href={qs({ email: e.id, page: undefined })}
                      className={`block px-4 py-3 transition hover:bg-paper-alt ${aktif ? "bg-paper-alt" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!e.isRead && e.direction === "inbound" && (
                          <span
                            aria-label="Belum dibaca"
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2C4A9E]"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {e.direction === "inbound" ? (
                              <Highlight text={e.fromName || e.fromEmail} terms={terms} />
                            ) : (
                              <>Ke: <Highlight text={e.to || "-"} terms={terms} /></>
                            )}
                          </p>
                          <p className={`truncate text-sm ${e.isRead ? "text-mist" : "font-medium"}`}>
                            <Highlight text={e.subject} terms={terms} />
                          </p>
                          {e.preview && (
                            <p className="truncate text-xs text-mist">
                              <Highlight text={e.preview} terms={terms} />
                            </p>
                          )}
                          <p className="mt-1 flex items-center gap-2 text-[11px] text-mist">
                            {waktu(e.date)}
                            {e.hasAttachments && <span title="Ada lampiran">📎</span>}
                            {(e.direction === "outbound" || e.direction === "draft") && (
                              <span className="rounded-full bg-[#EEF1F8] px-2 py-0.5 text-[10px] font-semibold text-[#3A4A75]">
                                {STATUS_LABEL[e.status] ?? e.status}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between border-t border-line px-4 py-2 text-sm">
            <Link
              href={qs({ page: page > 2 ? page - 1 : undefined })}
              aria-disabled={page <= 1}
              className={`text-mist ${page <= 1 ? "pointer-events-none opacity-40" : "hover:text-ink"}`}
            >
              ← Sebelumnya
            </Link>
            <span className="text-xs text-mist">Halaman {page}</span>
            <Link
              href={qs({ page: list.hasNext ? page + 1 : undefined })}
              aria-disabled={!list.hasNext}
              className={`text-mist ${!list.hasNext ? "pointer-events-none opacity-40" : "hover:text-ink"}`}
            >
              Berikutnya →
            </Link>
          </div>
        </div>

        <div className={`${card} min-w-0`}>
          {!selected ? (
            <p className="px-5 py-16 text-center text-sm text-mist">
              Pilih email di daftar untuk membaca.
            </p>
          ) : (
            <article className="flex flex-col gap-4 p-5">
              {/* PENTING: pakai <div>, bukan <header>. `globals.css` punya rule
                  global `header{position:fixed;top:0;left:0;right:0;z-index:100}`
                  yang管理软件 navbar publik — kalau ikut terpakai di sini, blok
                  ini meloncat ke atas layar dan menutupi sidebar + form. */}
              <div className="flex flex-col gap-1 border-b border-line pb-4">
                <h2 className="font-display text-lg font-semibold">{selected.subject}</h2>
                <p className="text-sm">
                  <span className="text-mist">From: </span>
                  {selected.fromName ? `${selected.fromName} ` : ""}
                  &lt;{selected.fromEmail}&gt;
                </p>
                <p className="text-sm">
                  <span className="text-mist">To: </span>
                  {selected.to || "-"}
                </p>
                {selected.cc && (
                  <p className="text-sm">
                    <span className="text-mist">Cc: </span>
                    {selected.cc}
                  </p>
                )}
                {selected.bcc && (
                  <p className="text-sm">
                    <span className="text-mist">Bcc: </span>
                    {selected.bcc}
                  </p>
                )}
                <p className="text-xs text-mist">
                  {selected.direction === "draft" ? "Disimpan" : "Received"}: {waktu(selected.date)}
                </p>
                {(selected.direction === "outbound" || selected.direction === "draft") && (
                  <p className="text-xs text-mist">
                    Status: {STATUS_LABEL[selected.status] ?? selected.status}
                    {selected.resendId ? ` · Ref ${selected.resendId}` : ""}
                  </p>
                )}
                {selected.errorMessage && (
                  <p className="text-xs text-[#9B2C2C]">{selected.errorMessage}</p>
                )}
              </div>

              <div className="max-w-none overflow-x-auto text-sm leading-relaxed">
                {selected.safeHtml ? (
                  // SUDAH disanitasi di server (script/iframe/event handler dibuang).
                  <div dangerouslySetInnerHTML={{ __html: selected.safeHtml }} />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans">{selected.textBody ?? ""}</pre>
                )}
              </div>

              {selected.attachments.filter((a) => !a.isInline).length > 0 && (
                <section className="border-t border-line pt-3">
                  <h3 className="text-xs font-semibold text-mist">Attachments</h3>
                  <ul className="mt-2 flex flex-col gap-1">
                    {selected.attachments
                      .filter((a) => !a.isInline)
                      .map((a) => (
                        <li key={a.id}>
                          <a
                            href={`/api/admin/email/attachment/${a.id}`}
                            className="text-sm font-semibold text-[#2C4A9E] hover:underline"
                          >
                            📎 {a.filename}
                          </a>
                          <span className="ml-2 text-xs text-mist">{ukuran(a.size)}</span>
                        </li>
                      ))}
                  </ul>
                </section>
              )}

              {/* Sama seperti di atas: <footer> kena rule global
                  `footer{background:#0F1836;...}` milik footer situs publik. */}
              <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
                {selected.direction === "inbound" && (
                  <>
                    <button type="button" onClick={() => setMode("reply")} className={btnNavy}>
                      Balas
                    </button>
                    <button type="button" onClick={() => setMode("forward")} className={btnGhost}>
                      Teruskan
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRead(selected.id, !selected.isRead)}
                      className={btnGhost}
                    >
                      {selected.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                    </button>
                  </>
                )}

                {selected.direction === "draft" && (
                  <p className="text-xs text-mist">
                    Draft dibuka untuk dilanjutkan di form di atas — ubah, lalu Kirim
                    atau Simpan Draft lagi.
                  </p>
                )}

                {selected.direction === "outbound" && (
                  <Link href={qs({ email: undefined, tab: "sent" })} className={btnGhost}>
                    Lihat Terkirim
                  </Link>
                )}

                {/* Hapus: email keluar & draft dihapus permanen; email masuk hanya
                    disembunyikan (aslinya masih ada di mailbox). */}
                {hapusId === selected.id ? (
                  <form action={deleteFormAction} className="ml-auto flex items-center gap-2">
                    <input type="hidden" name="id" value={selected.id} />
                    <span className="text-xs text-mist">
                      {selected.isHidden
                        ? "Sembunyikan email ini dari daftar?"
                        : "Hapus permanen?"}
                    </span>
                    <button type="submit" className={btnDanger}>
                      Ya, {selected.isHidden ? "sembunyikan" : "hapus"}
                    </button>
                    <button type="button" className={btnGhost} onClick={() => setHapusId(null)}>
                      Batal
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className={`${btnDanger} ml-auto`}
                    onClick={() => setHapusId(selected.id)}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
