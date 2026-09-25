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
