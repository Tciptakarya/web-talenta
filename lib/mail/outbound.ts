/**
 * Logika outgoing Email Center (server-only): compose / reply / teruskan.
 *
 * Semua pengiriman tetap lewat **Resend** (provider existing project) — tidak
 * ada SMTP kedua. Reply memakai header asli (`In-Reply-To` + `References`) dari
 * email asal supaya thread dikenali Gmail/Outlook.
 */
import { prisma } from "@/lib/prisma";
import { sendPanelEmail, panelResendKey } from "@/lib/resend";
import {
  MAX_EMAIL_ATTACHMENTS,
  MAX_EMAIL_ATTACHMENT_BYTES,
  isBlockedEmailFilename,
  safeEmailFilename,
  type EmailSendInput,
} from "@/lib/schemas";

export type AttachmentInput = {
  filename: string;
  type: string;
  size: number;
  bytes: Buffer;
};

export type SendOutcome = {
  ok: boolean;
  message: string;
  status?: "sent" | "failed" | "skipped";
};

/** Body email sebagai HTML sederhana + versi teks polos. */
function bodyToHtml(body: string, quoted?: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const main = escape(body)
    .split("\n")
    .map((line) => (line.trim() ? `<p style="margin:0 0 12px">${line}</p>` : ""))
    .join("");
  const quote = quoted
    ? `<div style="margin-top:22px;padding-top:16px;border-top:1px solid #E1E6F2;color:#5A6787;font-size:13px">${escape(quoted)
        .split("\n")
        .map((l) => `<p style="margin:0 0 8px">${l}</p>`)
        .join("")}</div>`
    : "";
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#1C2333;max-width:640px">${main}${quote}</div>`;
}

/** Siapkan parameter reply: penerima, subjek, dan header threading asli. */
async function replyContext(emailId: number) {
  const src = await prisma.emailMessage.findUnique({ where: { id: emailId } });
  if (!src) return null;
  const to =
    src.direction === "inbound"
      ? [src.fromEmail].filter(Boolean)
      : (JSON.parse(src.toEmails || "[]") as string[]);
  const subject = /^re:/i.test(src.subject ?? "") ? (src.subject ?? "") : `Re: ${src.subject ?? ""}`;
  const references = [src.referencesText, src.messageId].filter(Boolean).join(" ");
  return { src, to, subject, references };
}

export async function sendFromPanel(
  input: EmailSendInput,
  attachments: AttachmentInput[]
): Promise<SendOutcome> {
  if (!panelResendKey()) {
    return { ok: false, message: "Email tidak dapat dikirim: API key belum dikonfigurasi." };
  }

  // Validasi lampiran: jumlah, ukuran, nama/ekstensi berbahaya.
  if (attachments.length > MAX_EMAIL_ATTACHMENTS) {
    return { ok: false, message: `Maksimal ${MAX_EMAIL_ATTACHMENTS} lampiran per email.` };
  }
  for (const a of attachments) {
    if (a.size > MAX_EMAIL_ATTACHMENT_BYTES) {
      return {
        ok: false,
        message: `Lampiran "${safeEmailFilename(a.filename)}" melebihi batas 8 MB.`,
      };
    }
    if (isBlockedEmailFilename(a.filename)) {
      return {
        ok: false,
        message: `Lampiran "${safeEmailFilename(a.filename)}" tidak diizinkan (tipe berkas berisiko).`,
      };
    }
  }

  let to = input.to;
  let subject = input.subject;
  let inReplyTo: string | undefined;
  let references: string | undefined;
  let quoted: string | undefined;
  let threadId: string | null = null;

  if ((input.mode === "reply" || input.mode === "forward") && input.replyToId) {
    const ctx = await replyContext(input.replyToId);
    if (ctx) {
      threadId = ctx.src.threadId ?? ctx.src.messageId;
      if (input.mode === "reply") {
        to = ctx.to.length ? ctx.to : input.to;
        subject = ctx.subject;
        inReplyTo = ctx.src.messageId ?? undefined;
        references = ctx.references || undefined;
        quoted = ctx.src.textBody?.slice(0, 4000);
      } else {
        // Teruskan: penerima & subjek tetap milik admin, hanya kutipan yang ikut.
        quoted = [
          ctx.src.textBody?.slice(0, 4000),
          ctx.src.messageId ? `[Message-ID: ${ctx.src.messageId}]` : null,
        ]
          .filter(Boolean)
          .join("\n\n");
      }
    }
  }

  const html = bodyToHtml(input.body, quoted);
  const text = [input.body, quoted ? `\n\n--- Email asli ---\n${quoted}` : null]
    .filter(Boolean)
    .join("\n");

  const result = await sendPanelEmail({
    to,
    cc: input.cc,
    bcc: input.bcc,
    subject,
    text,
    html,
    inReplyTo,
    references,
    attachments: attachments.map((a) => ({
      filename: safeEmailFilename(a.filename),
      contentType: a.type || "application/octet-stream",
      content: a.bytes,
    })),
  });

  // Log outgoing. Status TIDAK pernah diklaim "delivered" — hanya "sent"
  // (API Resend menerima) atau "failed"/"skipped". Delivered/bounced hanya
  // diisi lewat webhook Resend.
  await prisma.emailMessage.create({
    data: {
      direction: "outbound",
      status: result.status,
      threadId,
      inReplyTo: inReplyTo ?? null,
      referencesText: references ?? null,
      fromEmail: "info@talentaciptakarya.com",
      toEmails: JSON.stringify(to),
      ccEmails: input.cc.length ? JSON.stringify(input.cc) : null,
      bccEmails: input.bcc.length ? JSON.stringify(input.bcc) : null,
      subject,
      textBody: text,
      htmlBody: html,
      hasAttachments: attachments.length > 0,
      isRead: true,
      sentAt: new Date(),
      resendId: result.resendId ?? null,
      errorMessage: result.status === "failed" ? (result.message ?? null) : null,
    },
  });

  if (result.status === "sent") {
    return { ok: true, message: "Email berhasil dikirim.", status: "sent" };
  }
  if (result.status === "skipped") {
    return { ok: false, message: result.message ?? "Email dilewati.", status: "skipped" };
  }
  return { ok: false, message: "Email gagal dikirim.", status: "failed" };
}
