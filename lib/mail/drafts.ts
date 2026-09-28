/**
 * Draft Email Center (server-only).
 *
 * Draft = `EmailMessage` dengan `direction: "draft"` dan `status: "draft"`,
 * jadi memakai tabel & kolom yang sama (bukan tabel/model baru). Yang
 * disimpan hanya **teks polos**: HTML dibangun ulang saat kirim, sehingga
 * draft tidak pernah menjadi sumber HTML yang belum disanitasi.
 *
 * Lampiran **tidak** disimpan di draft (isi berkas tidak disimpan di
 * database) — pemanggil wajib memberi tahu pengguna bila ada lampiran.
 */
import { prisma } from "@/lib/prisma";
import { previewFromText } from "@/lib/mail/sanitize";
import type { EmailSendInput } from "@/lib/schemas";

export type DraftOutcome = {
  ok: boolean;
  draftId?: number;
  message: string;
};

/** Alamat pengirim yang dipakai pada baris draft. */
const FROM_EMAIL = "info@talentaciptakarya.com";

/**
 * Simpan draft baru atau perbarui draft yang sudah ada.
 * `draftId` kosong → membuat draft baru.
 */
export async function saveDraft(
  input: Pick<EmailSendInput, "to" | "cc" | "bcc" | "subject" | "body"> & {
    draftId?: number;
  },
  opts: { hasAttachments: boolean }
): Promise<DraftOutcome> {
  const adaIsi =
    input.to.length > 0 || input.cc.length > 0 || input.bcc.length > 0 ||
    input.subject.trim().length > 0 || input.body.trim().length > 0;

  if (!adaIsi) {
    return { ok: false, message: "Draft kosong tidak disimpan. Isi minimal subjek atau penerima." };
  }

  const data = {
    direction: "draft",
    status: "draft",
    fromEmail: FROM_EMAIL,
    toEmails: JSON.stringify(input.to),
    ccEmails: input.cc.length ? JSON.stringify(input.cc) : null,
    bccEmails: input.bcc.length ? JSON.stringify(input.bcc) : null,
    subject: input.subject.trim() || "(tanpa subjek)",
    textBody: input.body,
    htmlBody: null, // sengaja: HTML dibangun saat kirim
    preview: previewFromText(input.body, 140),
    isRead: true,
    hasAttachments: false,
  };

  if (input.draftId) {
    const ada = await prisma.emailMessage.findFirst({
      where: { id: input.draftId, direction: "draft", deletedAt: null },
      select: { id: true },
    });
    if (ada) {
      await prisma.emailMessage.update({ where: { id: ada.id }, data });
      return {
        ok: true,
        draftId: ada.id,
        message: opts.hasAttachments
          ? "Draft disimpan. Lampiran tidak ikut tersimpan di draft."
          : "Draft diperbarui.",
      };
    }
    // Draft lama sudah dihapus → buat baru (bukan galat).
  }

  const draft = await prisma.emailMessage.create({ data });
  return {
    ok: true,
    draftId: draft.id,
    message: opts.hasAttachments
      ? "Draft disimpan. Lampiran tidak ikut tersimpan di draft."
      : "Draft tersimpan.",
  };
}

/** Hapus draft setelah berhasil dikirim (kirim tidak menyisakan draft). */
export async function dropDraft(draftId: number): Promise<void> {
  await prisma.emailMessage
    .deleteMany({ where: { id: draftId, direction: "draft" } })
    .catch(() => undefined);
}
