import { Resend } from "resend";

export type EmailStatus = "sent" | "failed" | "skipped";

/** Base URL situs untuk link reset (NEXT_PUBLIC_SITE_URL atau fallback). */
function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

/**
 * Kirim notifikasi email untuk setiap pesan form kontak (PRD §6).
 * - RESEND_API_KEY kosong → "skipped" (pesan tetap tersimpan di DB, §8)
 * - Pengiriman gagal → "failed" (pesan tetap tersimpan di DB, §8)
 */
export async function sendContactNotification(input: {
  nama: string;
  email: string;
  pesan: string;
}): Promise<EmailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[resend] RESEND_API_KEY belum diisi — notifikasi email dilewati, pesan tetap tersimpan di database."
    );
    return "skipped";
  }

  const to = process.env.CONTACT_EMAIL_TO || "info@talentaciptakarya.com";
  const from = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email,
      subject: `Pesan baru dari ${input.nama} — Website Talenta Cipta Karya`,
      text: [
        "Halo tim Talenta Cipta Karya,",
        "",
        "Ada pesan baru masuk dari form kontak website:",
        "",
        `Nama  : ${input.nama}`,
        `Email : ${input.email}`,
        "",
        "Pesan:",
        input.pesan,
        "",
        "— Notifikasi otomatis dari talentaciptakarya.com",
      ].join("\n"),
    });

    if (error) {
      console.error("[resend] pengiriman gagal:", error);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[resend] exception:", err);
    return "failed";
  }
}

/**
 * Kirim email link reset password admin (§8).
 * Selalu dipanggil setelah token disimpan — raw token TIDAK disimpan di DB.
 */
export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
}): Promise<EmailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[resend] RESEND_API_KEY belum diisi — email reset dilewati (link reset hanya bisa diuji lewat log server)."
    );
    console.info(`[resend:debug] Reset link untuk ${input.to}: ${input.resetUrl}`);
    return "skipped";
  }

  const from = process.env.CONTACT_EMAIL_FROM || "Talenta Cipta Karya <info@talentaciptakarya.com>";
  // Pastikan format "Name <email>" atau email saja
  const fromHeader = from.includes("<") ? from : `Talenta Cipta Karya <${from}>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromHeader,
      to: input.to,
      subject: "Reset Password Admin - Talenta Cipta Karya",
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#1C2333;line-height:1.6">
          <h2 style="color:#16214A;margin:0 0 12px">Reset Password Admin</h2>
          <p>Halo Admin,</p>
          <p>Kami menerima permintaan untuk mengatur ulang password akun Admin Talenta Cipta Karya.</p>
          <p>Klik tombol berikut untuk membuat password baru:</p>
          <p style="margin:22px 0">
            <a href="${input.resetUrl}" style="display:inline-block;background:#16214A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:700;font-size:14px">Reset Password</a>
          </p>
          <p style="font-size:13px;color:#7C8AA8">Link reset password ini berlaku selama <strong>30 menit</strong> dan hanya dapat digunakan satu kali.</p>
          <p style="font-size:13px;color:#7C8AA8">Jika Anda tidak meminta perubahan password, abaikan email ini.</p>
          <p style="margin-top:20px">Salam,<br><strong>Talenta Cipta Karya</strong></p>
          <hr style="border:none;border-top:1px solid #E1E6F2;margin:20px 0" />
          <p style="font-size:12px;color:#7C8AA8">Jika tombol tidak berfungsi, salin link berikut ke browser:<br><a href="${input.resetUrl}" style="color:#2C4A9E;word-break:break-all">${input.resetUrl}</a></p>
        </div>
      `,
      text: [
        "Halo Admin,",
        "",
        "Kami menerima permintaan untuk mengatur ulang password akun Admin Talenta Cipta Karya.",
        "",
        `Klik link berikut untuk membuat password baru (berlaku 30 menit, sekali pakai):`,
        input.resetUrl,
        "",
        "Jika Anda tidak meminta perubahan password, abaikan email ini.",
        "",
        "Salam,",
        "Talenta Cipta Karya",
      ].join("\n"),
    });

    if (error) {
      console.error("[resend] reset email gagal:", error);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[resend] reset email exception:", err);
    return "failed";
  }
}

/**
 * Kirim notifikasi email untuk setiap pendaftaran pelatihan baru.
 * Dipanggil SETELAH baris Pendaftaran tersimpan — pola reliabilitas sama dengan
 * ContactMessage (§8): gagal kirim → status "failed", data tetap di dashboard.
 */
export async function sendPendaftaranNotification(input: {
  nama: string;
  wa: string;
  email: string | null;
  catatan: string | null;
  programJudul: string;
  jadwalLabel: string;
  jamLabel: string;
  ruangan: string | null;
}): Promise<EmailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[resend] RESEND_API_KEY belum diisi — notifikasi pendaftaran dilewati, data tetap tersimpan di database."
    );
    return "skipped";
  }

  const to = process.env.CONTACT_EMAIL_TO || "info@talentaciptakarya.com";
  const from = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      ...(input.email ? { replyTo: input.email } : {}),
      subject: `Pendaftaran baru: ${input.nama} — ${input.programJudul}`,
      text: [
        "Halo tim Talenta Cipta Karya,",
        "",
        "Ada pendaftaran baru dari website:",
        "",
        `Nama       : ${input.nama}`,
        `WhatsApp   : ${input.wa}`,
        `Email      : ${input.email || "-"}`,
        "",
        `Program    : ${input.programJudul}`,
        `Jadwal     : ${input.jadwalLabel}`,
        `Waktu      : ${input.jamLabel}`,
        `Ruangan    : ${input.ruangan || "-"}`,
        "",
        "Catatan pendaftar:",
        input.catatan || "-",
        "",
        "Tindak lanjut: konfirmasi kursi via WhatsApp, lalu ubah statusnya di",
        `${siteUrl()}/admin/pendaftaran`,
        "",
        "— Notifikasi otomatis dari talentaciptakarya.com",
      ].join("\n"),
    });

    if (error) {
      console.error("[resend] pendaftaran email gagal:", error);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[resend] pendaftaran email exception:", err);
    return "failed";
  }
}

export { siteUrl };

/* =====================================================================
   Email Center (Admin > Email) — outgoing & reply
   Memakai PROVIDER & KONVESI YANG SAMA dengan notifikasi di atas
   (tidak ada service email kedua).
   ===================================================================== */

export type PanelSendStatus = "sent" | "failed" | "skipped";

export type PanelSendResult = {
  status: PanelSendStatus;
  /** id email dari Resend — dipakai untuk pelacakan status (webhook) */
  resendId?: string;
  /** pesan ramah untuk UI; tanpa secret/stack trace */
  message?: string;
};

/**
 * API key Email Center. `PANEL_RESEND_API_KEY` dipakai bila ada (dipisah dari
 * notifikasi aplikasi agar Email Center bisa punya key sendiri), fallback ke
 * `RESEND_API_KEY` supaya tidak ada email yang tiba-tiba gagal diam-diam.
 */
export function panelResendKey(): string | null {
  return process.env.PANEL_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY?.trim() || null;
}

/** Pengirim Email Center — selalu "Nama <email>" agar konsisten. */
function panelFrom(): string {
  const raw = process.env.CONTACT_EMAIL_FROM?.trim() || "info@talentaciptakarya.com";
  return raw.includes("<") ? raw : `Talenta Cipta Karya <${raw}>`;
}

export type PanelAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

/**
 * Kirim / balas / teruskan email dari Admin Email Center.
 *
 * Reply memakai header asli (`In-Reply-To` + `References`) sehingga Gmail,
 * Outlook, dan email client lain mengenali email ini sebagai satu percakapan —
 * bukan sekadar awalan "Re:" (spesifikasi §5).
 */
/** Versi teks polos dari HTML — dipakai bila admin hanya mengisi HTML. */
function textFromHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendPanelEmail(input: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string[];
  inReplyTo?: string;
  references?: string;
  attachments?: PanelAttachment[];
}): Promise<PanelSendResult> {
  const apiKey = panelResendKey();
  if (!apiKey) {
    console.warn("[resend] PANEL_RESEND_API_KEY/RESEND_API_KEY kosong — email Email Center dilewati.");
    return { status: "skipped", message: "Email tidak dapat dikirim: API key belum dikonfigurasi." };
  }
  if (input.to.length === 0) {
    return { status: "failed", message: "Email tidak dapat dikirim: penerima kosong." };
  }

  // Header threading hanya bila memang membalas email yang ada.
  const headers: Record<string, string> = {};
  if (input.inReplyTo) headers["In-Reply-To"] = input.inReplyTo;
  if (input.references) headers.References = input.references;

  // Selalu kirim versi teks (multipart): Resend mensyaratkan minimal satu
  // format, dan email client lama lebih baik menerima teks polos.
  const text = input.text?.trim() || (input.html ? textFromHtml(input.html) : "");

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: panelFrom(),
      to: input.to,
      ...(input.cc?.length ? { cc: input.cc } : {}),
      ...(input.bcc?.length ? { bcc: input.bcc } : {}),
      ...(input.replyTo?.length ? { replyTo: input.replyTo } : {}),
      subject: input.subject,
      text,
      ...(input.html ? { html: input.html } : {}),
      ...(Object.keys(headers).length ? { headers } : {}),
      ...(input.attachments?.length
        ? {
            attachments: input.attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              content_type: a.contentType,
            })),
          }
        : {}),
    });

    if (error) {
      console.error("[resend] panel email gagal:", error);
      return { status: "failed", message: "Email gagal dikirim." };
    }
    // Status "sent" = API Resend MENERIMA permintaan. Status delivered/bounced
    // hanya diisi dari webhook Resend (tidak diklaim di sini).
    return { status: "sent", resendId: data?.id };
  } catch (err) {
    console.error("[resend] panel email exception:", err);
    return { status: "failed", message: "Email gagal dikirim." };
  }
}
