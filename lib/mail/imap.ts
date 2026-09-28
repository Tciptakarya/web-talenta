/**
 * Klien IMAP untuk Email Center — **server-only**.
 *
 * Dipanggil HANYA dari server action atau route API. Tidak pernah mengirim
 * kredensial ke browser: fungsi ini mengembalikan data yang sudah diparse, dan
 * error disanitasi menjadi pesan ramah untuk user (detail asli hanya
 * `console.error` di server).
 *
 * Konfigurasi lewat env (lihat `.env.example`):
 *   MAIL_IMAP_HOST, MAIL_IMAP_PORT, MAIL_IMAP_USER, MAIL_IMAP_PASSWORD,
 *   MAIL_IMAP_SECURE
 * Kredensial TIDAK PERNAH disimpan di source code.
 */
import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";

/** Error IMAP dengan pesan user-friendly (tanpa host/kredensial). */
export class MailError extends Error {
  constructor(
    message: string,
    readonly userMessage: string
  ) {
    super(message);
    this.name = "MailError";
  }
}

export type ImapConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
};

/** null = belum dikonfigurasi (bukan error fatal; UI menampilkan instruksi). */
export function imapConfig(): ImapConfig | null {
  const host = process.env.MAIL_IMAP_HOST?.trim();
  const user = process.env.MAIL_IMAP_USER?.trim();
  const pass = process.env.MAIL_IMAP_PASSWORD;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.MAIL_IMAP_PORT || 993),
    user,
    pass,
    secure: (process.env.MAIL_IMAP_SECURE ?? "true") !== "false",
  };
}

export const IMAP_NOT_CONFIGURED =
  "Email masuk belum dikonfigurasi. Isi MAIL_IMAP_HOST, MAIL_IMAP_USER, dan MAIL_IMAP_PASSWORD di environment server.";

/** Batas waktu per operasi agar tidak menggantung di serverless. */
const TIMEOUT_MS = Number(process.env.MAIL_IMAP_TIMEOUT_MS || 20000);

function timeoutError(label: string): MailError {
  return new MailError(
    `IMAP timeout: ${label}`,
    "Tidak dapat mengambil email saat ini. Coba lagi sebentar."
  );
}

async function withTimeout<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race<T>([
      fn(),
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(timeoutError(label)), TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function sanitizeImapError(err: unknown, label: string): MailError {
  if (err instanceof MailError) return err;
  const raw = err instanceof Error ? err.message : String(err);
  // Buang kemungkinan kebocoran alamat/kredensial dari pesan upstream.
  const safe = raw
    .replace(/[^\s@]+@[^\s@]+/g, "[email]")
    .replace(/(password|pass|auth|token|key)\s*[:=]\s*\S+/gi, "$1=[disembunyikan]")
    .slice(0, 200);
  console.error(`[imap] ${label}:`, raw);
  return new MailError(
    `IMAP error: ${label} (${safe})`,
    "Tidak dapat mengambil email saat ini. Coba lagi sebentar."
  );
}

/** Jalankan `fn` dengan koneksi IMAP; logout otomatis di akhir scope. */
async function withClient<T>(
  cfg: ImapConfig,
  label: string,
  fn: (client: ImapFlow) => Promise<T>
): Promise<T> {
  const client = new ImapFlow({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    logger: false,
  });
  try {
    await withTimeout(`${label}: connect`, () => client.connect());
    return await withTimeout(label, () => fn(client));
  } catch (err) {
    throw sanitizeImapError(err, label);
  } finally {
    await client.logout().catch(() => undefined);
  }
}

export type MailboxMessage = {
  uid: number;
  seen: boolean;
  parsed: ParsedMail;
};

/** Ambil N pesan terbaru dari folder (default INBOX) beserta hasil parse. */
export async function fetchRecentMessages(
  cfg: ImapConfig,
  limit: number,
  folder = "INBOX"
): Promise<MailboxMessage[]> {
  return withClient(cfg, "fetch recent", async (client) => {
    await client.mailboxOpen(folder);
    const found = await client.search({}, { uid: true });
    const uids = found === false || !found ? [] : found;
    if (uids.length === 0) return [];

    const slice = uids.slice(-limit);
    const out: MailboxMessage[] = [];
    for await (const msg of client.fetch(
      slice,
      { source: true, uid: true, flags: true },
      { uid: true }
    )) {
      if (!msg.source) continue;
      out.push({
        uid: msg.uid,
        seen: (msg.flags ?? new Set()).has("\\Seen"),
        parsed: await simpleParser(msg.source),
      });
    }
    return out;
  });
}

/** Ambil satu pesan berdasarkan UID (dipakai route download lampiran). */
export async function fetchMessageByUid(
  cfg: ImapConfig,
  uid: number,
  folder = "INBOX"
): Promise<ParsedMail> {
  return withClient(cfg, "fetch one", async (client) => {
    await client.mailboxOpen(folder);
    for await (const msg of client.fetch(
      uid,
      { source: true, uid: true },
      { uid: true }
    )) {
      if (!msg.source) break;
      return await simpleParser(msg.source);
    }
    throw new MailError("IMAP: pesan tidak ditemukan", "Email tidak ditemukan.");
  });
}

/**
 * Tandai read (`\Seen`) atau unread di sisi mailbox agar tetap sinkron dengan
 * email client lain. Kegagalan tidak menggagalkan perubahan status di DB.
 */
export async function setSeenFlag(
  cfg: ImapConfig,
  uid: number,
  seen: boolean,
  folder = "INBOX"
): Promise<void> {
  await withClient(cfg, seen ? "mark read" : "mark unread", async (client) => {
    await client.mailboxOpen(folder);
    if (seen) {
      await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });
    } else {
      await client.messageFlagsRemove(uid, ["\\Seen"], { uid: true });
    }
  });
}

/** Ambil isi satu lampiran dari pesan (bytes) — untuk route download. */
export async function fetchAttachment(
  cfg: ImapConfig,
  uid: number,
  opts: { filename?: string; contentId?: string; folder?: string }
): Promise<{ filename: string; mimeType: string; content: Buffer }> {
  const parsed = await fetchMessageByUid(cfg, uid, opts.folder ?? "INBOX");
  const attachments = parsed.attachments ?? [];
  if (attachments.length === 0) {
    throw new MailError("IMAP: tidak ada lampiran", "Lampiran tidak ditemukan.");
  }
  const found =
    attachments.find((a) => opts.contentId && a.contentId === opts.contentId) ??
    attachments.find((a) => a.filename && opts.filename && a.filename === opts.filename) ??
    attachments[0];
  return {
    filename: found.filename || "lampiran",
    mimeType: found.contentType || "application/octet-stream",
    content: found.content,
  };
}
