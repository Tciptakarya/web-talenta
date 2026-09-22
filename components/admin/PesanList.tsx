"use client";

import { deleteContactMessage } from "@/app/admin/actions";

export type AdminMessage = {
  id: number;
  nama: string;
  email: string;
  pesan: string;
  statusEmail: string;
  createdAt: Date | string;
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  sent: { label: "Email terkirim", cls: "bg-green-100 text-green-800" },
  failed: { label: "Email gagal", cls: "bg-red-100 text-red-700" },
  skipped: { label: "Email dilewati", cls: "bg-amber-100 text-amber-800" },
  pending: { label: "Menunggu", cls: "bg-gray-100 text-gray-700" },
};

/** Inbox pesan form kontak — cadangan/riwayat (PRD §6). */
export default function PesanList({ messages }: { messages: AdminMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-line p-8 text-center">
        <p className="text-sm text-mist">
          Belum ada pesan masuk. Pesan dari form kontak akan tampil di sini
          sebagai cadangan notifikasi email.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => {
        const status =
          STATUS_LABEL[m.statusEmail] ?? STATUS_LABEL.pending!;
        const createdAt = new Date(m.createdAt);
        return (
          <article key={m.id} className="rounded-2xl bg-white border border-line p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-bold text-navy">{m.nama}</p>
              <a
                href={`mailto:${m.email}`}
                className="text-sm text-blue hover:underline break-all"
              >
                {m.email}
              </a>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${status.cls}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-sm text-ink mt-3 whitespace-pre-wrap">{m.pesan}</p>
            <div className="flex items-center justify-between mt-4">
              <time className="text-xs text-mist">
                {createdAt.toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
              <form
                action={deleteContactMessage}
                onSubmit={(e) => {
                  if (!confirm("Hapus pesan ini?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={m.id} />
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
