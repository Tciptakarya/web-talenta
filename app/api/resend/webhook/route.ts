import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Webhook Resend → memperbarui **status pengiriman yang sebenarnya**.
 *
 * Status "sent" hanya berarti API Resend menerima permintaan. Status
 * delivered / bounced baru bisa diketahui dari event Resend, jadi route ini
 * diperketat: webhook TIDAK diterima bila `RESEND_WEBHOOK_SECRET` belum diisi
 * atau signature tidak cocok (Resend mengirim header `resend-signature`
 * berformat `v1,<hmac-sha256>` atas payload mentah + timestamp).
 */
export const dynamic = "force-dynamic";

import { createHmac, timingSafeEqual } from "node:crypto";

/** Verifikasi signature `resend-signature`. */
function verifySignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = header.split(",");
  const v1 = parts.find((p) => p.startsWith("v1,"))?.slice(3);
  const t = parts.find((p) => p.startsWith("t,"))?.slice(2);
  if (!v1 || !t) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  const a = Buffer.from(v1, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Map event Resend → status di database (hanya yang benar-benar diberikan). */
function statusFromEvent(type: string): string | null {
  switch (type) {
    case "email.delivered":
      return "delivered";
    case "email.bounced":
      return "bounced";
    case "email.failed":
      return "failed";
    case "email.sent":
      return "sent";
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    // Tidak ada secret → jangan terima event apa pun (menolak lebih aman daripada
    // menerima status palsu).
    return NextResponse.json({ error: "Webhook belum dikonfigurasi." }, { status: 503 });
  }

  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get("resend-signature"), secret)) {
    return NextResponse.json({ error: "Signature tidak valid." }, { status: 401 });
  }

  let event: { type?: string; data?: { email_id?: string; reason?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const status = statusFromEvent(event.type ?? "");
  const emailId = event.data?.email_id;
  if (!status || !emailId) {
    return NextResponse.json({ received: true });
  }

  try {
    await prisma.emailMessage.updateMany({
      where: { resendId: emailId, direction: "outbound" },
      data: {
        status,
        ...(status === "bounced" || status === "failed"
          ? { errorMessage: (event.data?.reason ?? "Diberikan oleh Resend.").slice(0, 300) }
          : {}),
      },
    });
  } catch (err) {
    console.error("[email] webhook update gagal:", err);
    return NextResponse.json({ error: "Gagal menyimpan status." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
