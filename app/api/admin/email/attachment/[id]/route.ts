import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IMAP_NOT_CONFIGURED, MailError, fetchAttachment, imapConfig } from "@/lib/mail/imap";

/**
 * Download lampiran email masuk — **wajib session admin**.
 *
 * `middleware.ts` hanya melindungi `/admin/*`, jadi route `/api/*` melakukan
 * cek sendiri di sini. Kredensial IMAP tidak pernah keluar ke browser: file
 * diambil dari mailbox lalu di-stream sebagai response biasa.
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { id } = await params;
  const attachmentId = Number(id);
  if (!Number.isInteger(attachmentId) || attachmentId <= 0) {
    return NextResponse.json({ error: "Lampiran tidak valid." }, { status: 400 });
  }

  const attachment = await prisma.emailAttachment.findUnique({
    where: { id: attachmentId },
    include: {
      email: {
        select: { direction: true, imapUid: true, imapFolder: true, messageId: true },
      },
    },
  });
  if (!attachment || attachment.email.direction !== "inbound") {
    return NextResponse.json({ error: "Lampiran tidak ditemukan." }, { status: 404 });
  }

  const cfg = imapConfig();
  if (!cfg) {
    return NextResponse.json({ error: IMAP_NOT_CONFIGURED }, { status: 503 });
  }
  if (!attachment.email.imapUid) {
    return NextResponse.json(
      { error: "Lampiran tidak dapat diambil (email belum tersinkron)." },
      { status: 409 }
    );
  }

  try {
    const file = await fetchAttachment(cfg, Number(attachment.email.imapUid), {
      filename: attachment.filename,
      contentId: attachment.contentId ?? undefined,
      folder: attachment.email.imapFolder ?? "INBOX",
    });

    const inline = new URL(request.url).searchParams.get("inline") === "1";
    // Cegah filename berbahaya pada header (CR/LF) & karak non-ASCII.
    const safeName = file.filename.replace(/[\r\n"\\]/g, "_").slice(0, 120);

    return new NextResponse(new Uint8Array(file.content), {
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Length": String(file.content.length),
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${safeName}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    if (err instanceof MailError) {
      return NextResponse.json({ error: err.userMessage }, { status: 502 });
    }
    console.error("[email] gagal ambil lampiran:", err);
    return NextResponse.json(
      { error: "Tidak dapat mengambil lampiran saat ini." },
      { status: 500 }
    );
  }
}
