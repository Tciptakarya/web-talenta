/**
 * Sinkronisasi email masuk: IMAP (mailbox) → database (cache).
 *
 * Alur: IMAP → `lib/mail/imap.ts` → parse → upsert ke `EmailMessage`.
 * Admin UI hanya berbicara dengan database, tidak pernah langsung ke IMAP.
 *
 * Anti-duplikasi (§20): `messageId` (Message-ID RFC 5322) menjadi kunci unik.
 * Bila email tidak punya Message-ID, memakai kunci sintetis dari metadata
 * mailbox (`imap:<folder>:<uid>`) yang tetap unik dan stabil.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  IMAP_NOT_CONFIGURED,
  MailError,
  fetchRecentMessages,
  imapConfig,
  type ImapConfig,
} from "@/lib/mail/imap";
import { previewFromText } from "@/lib/mail/sanitize";

/** Batas aman: jangan pernah mengambil seluruh mailbox sekaligus. */
export const MAX_SYNC = 50;
export const DEFAULT_SYNC = 20;

export type SyncResult = {
  ok: boolean;
  message?: string;
  /** total email yang tersimpan di DB (bukan jumlah yang diproses) */
  totalInbound?: number;
  unread?: number;
};

/** Tipe alamat mailparser: bisa object, array, atau undefined. */
type Addr = { text?: string; value?: { address?: string }[] } | undefined;
type AddrInput =
  | { text?: string; value?: { address?: string }[] }
  | { text?: string; value?: { address?: string }[] }[]
  | undefined;

function norm(addr: AddrInput): Addr {
  if (!addr) return undefined;
  if (Array.isArray(addr)) return addr[0] as Addr;
  return addr as Addr;
}

function firstAddress(addr: AddrInput): { name: string | null; email: string } {
  const a = norm(addr);
  const v = a?.value?.[0];
  const email = v?.address ?? "";
  const name = a?.text && !a.text.includes("<") ? a.text : null;
  return { name, email };
}

function allAddresses(addr: AddrInput): string[] {
  const a = norm(addr);
  return (a?.value ?? [])
    .map((v) => v.address)
    .filter((x): x is string => Boolean(x));
}

export async function syncInbox(limit = DEFAULT_SYNC): Promise<SyncResult> {
  const cfg = imapConfig();
  if (!cfg) {
    return { ok: false, message: IMAP_NOT_CONFIGURED };
  }

  const take = Math.min(Math.max(1, limit), MAX_SYNC);

  try {
    const messages = await fetchRecentMessages(cfg, take);

    for (const m of messages) {
      const parsed = m.parsed;
      const from = firstAddress(parsed.from);
      // mailparser memberi `false` (bukan string) bila header Message-ID absen.
      const rawMessageId = typeof parsed.messageId === "string" ? parsed.messageId.trim() : "";
      const messageId = rawMessageId || `imap:INBOX:${m.uid}`;

      const attachments = parsed.attachments ?? [];
      const data: Omit<Prisma.EmailMessageUncheckedCreateInput, "messageId"> = {
        imapUid: String(m.uid),
        imapFolder: "INBOX",
        threadId: rawMessageId || null,
        inReplyTo: typeof parsed.inReplyTo === "string" ? parsed.inReplyTo : null,
        referencesText:
          typeof parsed.references === "string"
            ? parsed.references
            : (parsed.references?.join(" ") ?? null),
        direction: "inbound",
        status: "received",
        fromName: from.name,
        fromEmail: from.email || "(tidak diketahui)",
        toEmails: JSON.stringify(allAddresses(parsed.to)),
        ccEmails: allAddresses(parsed.cc).length
          ? JSON.stringify(allAddresses(parsed.cc))
          : null,
        bccEmails: allAddresses(parsed.bcc).length
          ? JSON.stringify(allAddresses(parsed.bcc))
          : null,
        replyToEmails: allAddresses(parsed.replyTo).length
          ? JSON.stringify(allAddresses(parsed.replyTo))
          : null,
        subject: parsed.subject ?? "(tanpa subjek)",
        preview: previewFromText(parsed.text ?? stripHtml(parsed.html)),
        textBody: parsed.text ?? null,
        htmlBody: typeof parsed.html === "string" ? parsed.html : null,
        hasAttachments: attachments.length > 0,
        isRead: m.seen,
        receivedAt: parsed.date ?? new Date(),
      };
      // Email yang pernah disembunyikan admin (deletedAt) TIDAK dibangkitkan
      // lagi: aslinya masih ada di mailbox, jadi tanpa ini email tersebut akan
      // muncul balik setiap kali Inbox disegarkan.
      const sudahDisembunyikan = await prisma.emailMessage.findFirst({
        where: { messageId, deletedAt: { not: null } },
        select: { id: true },
      });
      if (sudahDisembunyikan) continue;

      await prisma.emailMessage.upsert({
        where: { messageId },
        create: { messageId, ...data },
        update: {
          // Body & header tidak berubah; yang disegarkan hanya flag & waktu.
          isRead: data.isRead,
          status: "received",
          receivedAt: data.receivedAt,
          updatedAt: new Date(),
        },
      });

      // Simpan metadata lampiran (isi file diambil on-demand dari IMAP).
      const existing = await prisma.emailMessage.findUnique({
        where: { messageId },
        select: { id: true },
      });
      if (existing) {
        const stored = await prisma.emailAttachment.count({
          where: { emailId: existing.id },
        });
        if (stored === 0 && attachments.length > 0) {
          await prisma.emailAttachment.createMany({
            data: attachments.map((a) => ({
              emailId: existing.id,
              filename: (a.filename || "lampiran").slice(0, 200),
              mimeType: a.contentType || "application/octet-stream",
              size: a.content?.length ?? 0,
              partPath: a.contentId || a.filename || "0",
              contentId: a.cid || a.contentId || null,
              isInline: Boolean(a.cid),
            })),
          });
        }
      }
    }

    const [totalInbound, unread] = await Promise.all([
      prisma.emailMessage.count({ where: { direction: "inbound", deletedAt: null } }),
      prisma.emailMessage.count({
        where: { direction: "inbound", isRead: false, deletedAt: null },
      }),
    ]);

    return {
      ok: true,
      message: `Inbox diperbarui (${messages.length} email diproses).`,
      totalInbound,
      unread,
    };
  } catch (err) {
    const message =
      err instanceof MailError ? err.userMessage : "Tidak dapat mengambil email saat ini.";
    return { ok: false, message };
  }
}

/** Fallback preview bila email hanya punya HTML. */
function stripHtml(html: string | false | undefined): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

/** Tandai read/unread di DB; bila IMAP terpasang, sinkronkan juga flag mailbox. */
export async function setEmailRead(
  emailId: number,
  isRead: boolean,
  cfg: ImapConfig | null = imapConfig()
): Promise<{ ok: boolean; message?: string }> {
  const email = await prisma.emailMessage.findFirst({
    where: { id: emailId, deletedAt: null },
    select: { id: true, direction: true, imapUid: true, imapFolder: true },
  });
  if (!email) return { ok: false, message: "Email tidak ditemukan." };

  await prisma.emailMessage.update({
    where: { id: emailId },
    data: { isRead },
  });

  if (cfg && email.direction === "inbound" && email.imapUid) {
    try {
      const { setSeenFlag } = await import("@/lib/mail/imap");
      await setSeenFlag(cfg, Number(email.imapUid), isRead, email.imapFolder ?? "INBOX");
    } catch (err) {
      // State DB sudah tersimpan; mailbox mungkin tidak tersinkron.
      console.error("[mail] gagal menyinkronkan flag IMAP:", err);
    }
  }

  return { ok: true };
}
