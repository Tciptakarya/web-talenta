"use client";

import { deletePendaftaran, updateStatusPendaftaran } from "@/app/admin/actions";
import { PENDAFTARAN_STATUS_LIST } from "@/lib/schemas";

export type AdminPendaftaran = {
  id: number;
  nama: string;
  wa: string;
  email: string | null;
  catatan: string | null;
  status: string;
  statusEmail: string;
  /** ISO string — diformat di klien agar aman diserialisasi dari server. */
  createdAt: string;
  programJudul: string;
  jadwalLabel: string;
  jamLabel: string;
};

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  baru: { label: "Baru", cls: "bg-amber-100 text-amber-800" },
  dikonfirmasi: { label: "Dikonfirmasi", cls: "bg-blue-100 text-blue-800" },
  selesai: { label: "Selesai", cls: "bg-green-100 text-green-800" },
  ditolak: { label: "Ditolak", cls: "bg-gray-100 text-gray-600" },
};

const EMAIL_STYLE: Record<string, { label: string; cls: string }> = {
  sent: { label: "Email terkirim", cls: "text-green-700" },
  failed: { label: "Email gagal", cls: "text-red-600" },
  skipped: { label: "Email dilewati", cls: "text-amber-700" },
  pending: { label: "Email menunggu", cls: "text-mist" },
};

const selectCls =
  "rounded-xl border-[1.5px] border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy focus:outline-none focus:border-blue";

/** Normalisasi nomor Indonesia (08xx → 628xx) untuk tautan WhatsApp admin. */
function waFollowUp(p: AdminPendaftaran): string {
  const digit = p.wa.replace(/[^0-9]/g, "");
  const nomor = digit.startsWith("0")
    ? `62${digit.slice(1)}`
    : digit.startsWith("62")
      ? digit
      : `62${digit}`;
  const pesan = [
    `Halo ${p.nama}, terima kasih sudah mendaftar ${p.programJudul}`,
    `(${p.jadwalLabel}, ${p.jamLabel}) di Talenta Cipta Karya.`,
    "",
    "Kami ingin mengonfirmasi ketersediaan kursi Anda. Apakah data berikut sudah benar?",
  ].join(" ");
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}

/** Daftar pendaftar dari tabel jadwal publik — konfirmasi & ubah status (§ baru). */
export default function PendaftaranList({
  items,
}: {
  items: AdminPendaftaran[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-line p-8 text-center">
        <p className="text-sm text-mist">
          Belum ada pendaftaran masuk. Pendaftaran dari tombol &quot;Daftar&quot;
          di tabel jadwal publik akan tampil di sini.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((p) => {
        const status = STATUS_STYLE[p.status] ?? {
          label: p.status,
          cls: "bg-gray-100 text-gray-600",
        };
        const email = EMAIL_STYLE[p.statusEmail] ?? EMAIL_STYLE.pending!;
        const createdAt = new Date(p.createdAt);
        return (
          <article
            key={p.id}
            className="rounded-2xl bg-white border border-line p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-bold text-navy">{p.nama}</p>
              <a
                href={waFollowUp(p)}
                target="_blank"
                rel="noopener"
                className="text-sm text-blue hover:underline"
              >
                {p.wa}
              </a>
              {p.email && (
                <a
                  href={`mailto:${p.email}`}
                  className="text-sm text-blue hover:underline break-all"
                >
                  {p.email}
                </a>
              )}
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${status.cls}`}
              >
                {status.label}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <p className="text-ink">
                <span className="text-mist">Program:</span>{" "}
                <strong className="font-semibold">{p.programJudul}</strong>
              </p>
              <p className="text-ink">
                <span className="text-mist">Jadwal:</span> {p.jadwalLabel} ·{" "}
                {p.jamLabel}
              </p>
            </div>

            {p.catatan && (
              <p className="rounded-xl bg-paper border border-line px-3 py-2 text-sm text-ink whitespace-pre-wrap">
                {p.catatan}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <time className="text-xs text-mist">
                Didaftarkan{" "}
                {createdAt.toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
              <span className={`text-xs font-semibold ${email.cls}`}>
                {email.label}
              </span>

              <a
                href={waFollowUp(p)}
                target="_blank"
                rel="noopener"
                className="ml-auto rounded-full bg-navy text-white text-xs font-bold px-4 py-2 hover:-translate-y-0.5 transition"
              >
                Chat WA
              </a>

              <form action={updateStatusPendaftaran} className="flex items-center gap-2">
                <input type="hidden" name="id" value={p.id} />
                <label className="sr-only" htmlFor={`status-${p.id}`}>
                  Status pendaftaran
                </label>
                <select
                  id={`status-${p.id}`}
                  name="status"
                  defaultValue={p.status}
                  className={selectCls}
                >
                  {PENDAFTARAN_STATUS_LIST.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_STYLE[s]?.label ?? s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 transition"
                >
                  Simpan
                </button>
              </form>

              <form
                action={deletePendaftaran}
                onSubmit={(e) => {
                  if (!confirm(`Hapus pendaftaran "${p.nama}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </form>
            </div>
          </article>
        );
      })}
    </div>
  );
}
