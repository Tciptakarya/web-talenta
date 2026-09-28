import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { adminNavCounts } from "@/lib/adminCounts";
import { imapConfig } from "@/lib/mail/imap";
import { inlineMap, sanitizeEmailHtml } from "@/lib/mail/sanitize";
import { buildEmailWhere, highlightTerms, parseSearchQuery } from "@/lib/mail/search";
import EmailCenter, { type EmailDetail, type EmailRow } from "@/components/admin/EmailCenter";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

type SearchParams = {
  tab?: string;
  email?: string;
  q?: string;
  filter?: string;
  page?: string;
};

const TABS = ["inbox", "sent", "draft", "compose"] as const;
type Tab = (typeof TABS)[number];

function parseTab(raw: string | undefined): Tab {
  return (TABS as readonly string[]).includes(raw ?? "") ? (raw as Tab) : "inbox";
}

function addresses(json: string | null): string[] {
  try {
    const parsed = JSON.parse(json ?? "[]");
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Sanitasi HTML email di server SEBELUM dikirim ke browser. */
async function buildDetail(id: number): Promise<EmailDetail | null> {
  const email = await prisma.emailMessage.findFirst({
    where: { id, deletedAt: null },
    include: { attachments: { orderBy: { id: "asc" } } },
  });
  if (!email) return null;

  // Draft belum pernah dikirim → tidak ada HTML yang perlu ditampilkan.
  const safeHtml =
    email.direction !== "draft" && email.htmlBody
      ? sanitizeEmailHtml(email.htmlBody, {
          emailId: email.id,
          inlineIds: inlineMap(email.attachments),
        })
      : null;

  return {
    id: email.id,
    direction: email.direction,
    status: email.status,
    subject: email.subject ?? "(tanpa subjek)",
    fromName: email.fromName,
    fromEmail: email.fromEmail,
    to: addresses(email.toEmails).join(", "),
    cc: addresses(email.ccEmails).join(", "),
    bcc: addresses(email.bccEmails).join(", "),
    date: (email.receivedAt ?? email.sentAt ?? email.createdAt).toISOString(),
    preview: email.preview,
    textBody: email.textBody,
    safeHtml,
    isRead: email.isRead,
    resendId: email.resendId,
    errorMessage: email.errorMessage,
    canDelete: email.direction !== "inbound",
    isHidden: email.direction === "inbound",
    attachments: email.attachments.map((a) => ({
      id: a.id,
      filename: a.filename,
      mimeType: a.mimeType,
      size: a.size,
      isInline: a.isInline,
    })),
  };
}

async function listRows(args: {
  where: Prisma.EmailMessageWhereInput;
  query: ReturnType<typeof parseSearchQuery>;
  page: number;
}): Promise<{
  items: EmailRow[];
  total: number;
  hasNext: boolean;
}> {
  const page = Math.max(1, Number(args.page) || 1);
  const where = buildEmailWhere(args.where, args.query);
  const orderBy =
    args.where.direction === "outbound"
      ? { sentAt: "desc" as const }
      : args.where.direction === "draft"
        ? { updatedAt: "desc" as const }
        : { receivedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.emailMessage.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        direction: true,
        status: true,
        subject: true,
        fromName: true,
        fromEmail: true,
        preview: true,
        isRead: true,
        hasAttachments: true,
        receivedAt: true,
        sentAt: true,
        createdAt: true,
        toEmails: true,
      },
    }),
    prisma.emailMessage.count({ where }),
  ]);

  return {
    items: items.map((e) => ({
      id: e.id,
      direction: e.direction,
      status: e.status,
      subject: e.subject ?? "(tanpa subjek)",
      fromName: e.fromName,
      fromEmail: e.fromEmail,
      to: addresses(e.toEmails).join(", "),
      preview: e.preview,
      isRead: e.isRead,
      hasAttachments: e.hasAttachments,
      date: (e.receivedAt ?? e.sentAt ?? e.createdAt).toISOString(),
    })),
    total,
    hasNext: page * PER_PAGE < total,
  };
}

export default async function AdminEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tab = parseTab(sp.tab);
  const rawQuery = (sp.q ?? "").trim();
  const query = parseSearchQuery(rawQuery);
  const filter = sp.filter ?? "all";
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const cfg = imapConfig();

  const alive = { deletedAt: null } as const;

  const inboxWhere: Prisma.EmailMessageWhereInput = {
    ...alive,
    direction: "inbound",
    ...(filter === "unread" ? { isRead: false } : {}),
    ...(filter === "read" ? { isRead: true } : {}),
  };

  const sentWhere: Prisma.EmailMessageWhereInput = {
    ...alive,
    direction: "outbound",
    ...(filter === "ok" ? { status: { in: ["sent", "delivered"] } } : {}),
    ...(filter === "fail" ? { status: { in: ["failed", "bounced", "skipped"] } } : {}),
  };

  const draftWhere: Prisma.EmailMessageWhereInput = { ...alive, direction: "draft" };

  const [inbox, sent, drafts, selected, counts] = await Promise.all([
    listRows({ where: inboxWhere, query, page }),
    listRows({ where: sentWhere, query, page }),
    listRows({ where: draftWhere, query, page }),
    sp.email ? buildDetail(Number(sp.email)) : Promise.resolve(null),
    adminNavCounts(),
  ]);

  const fromLabel = process.env.CONTACT_EMAIL_FROM?.includes("<")
    ? process.env.CONTACT_EMAIL_FROM
    : `Talenta Cipta Karya <${process.env.CONTACT_EMAIL_FROM ?? "info@talentaciptakarya.com"}>`;

  // `onboarding@resend.dev` HANYA boleh mengirim ke email pemilik akun
  // (Resend membalas HTTP 403 untuk penerima lain — terverifikasi 2026-09-28).
  // Jadi beri tahu admin SEBELUM mencoba kirim, bukan setelah gagal.
  const fromWarning = /onboarding@resend\.dev/i.test(fromLabel)
    ? "Alamat pengirim masih onboarding@resend.dev. Email hanya bisa terkirim ke email pemilik akun; Resend menolak penerima lain (HTTP 403). Perbaiki CONTACT_EMAIL_FROM di environment server menjadi alamat domain yang sudah diverifikasi, contoh: Talenta Cipta Karya <info@talentaciptakarya.com>."
    : null;

  return (
    <EmailCenter
      tab={tab}
      q={rawQuery}
      terms={highlightTerms(query)}
      filter={filter}
      page={page}
      inbox={inbox}
      sent={sent}
      drafts={drafts}
      selected={selected}
      unreadTotal={counts.unreadEmail}
      imapConfigured={Boolean(cfg)}
      mailto={process.env.CONTACT_EMAIL_TO ?? "info@talentaciptakarya.com"}
      fromLabel={fromLabel}
      fromWarning={fromWarning}
    />
  );
}
