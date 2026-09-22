import { Resend } from "resend";

export type EmailStatus = "sent" | "failed" | "skipped";

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
