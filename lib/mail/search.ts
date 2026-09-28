/**
 * Parser & penyusun kueri pencarian Email Center.
 *
 * Tujuannya **akurasi**, bukan sekadar kecepatan:
 *
 * 1. Kata kunci dipecah per spasi dan digabung dengan logika **AND** — dulu
 *    "deployment vercel" dicari sebagai satu frasa utuh sehingga nihil, kini
 *    dicari email yang memuat kedua kata.
 * 2. Setiap kata boleh cocok di subjek, nama/alamat pengirim, penerima,
 *    isi email, pratinjau, atau **nama lampiran**.
 * 3. Operator eksplisit: `from:`, `to:`, `subjek:`/`subject:`,
 *    `dengan:lampiran`, `lampiran:ya|tidak`.
 *
 * Semua operator bersifat opsional; pencarian kosong tetap valid.
 */
import type { Prisma } from "@prisma/client";

export type ParsedQuery = {
  /** Kata kunci bebas (harus semuanya cocok). */
  terms: string[];
  from?: string;
  to?: string;
  subjek?: string;
  /** `dengan:lampiran` — hanya email yang punya lampiran. */
  denganLampiran?: boolean;
  /** `lampiran:ya` / `lampiran:tidak`. */
  lampiran?: boolean;
  /** Query mentah untuk ditampilkan kembali di kolom pencarian. */
  raw: string;
};

const OPERATORS = ["from", "to", "subjek", "subject", "dengan", "lampiran"];

/** Pecah `from:info@talentaciptakarya.com` → ["from", "info@…"]. */
function splitToken(token: string): { key: string; value: string } | null {
  const i = token.indexOf(":");
  if (i < 0) return null;
  const key = token.slice(0, i).toLowerCase();
  if (!OPERATORS.includes(key)) return null;
  return { key, value: token.slice(i + 1).trim() };
}

export function parseSearchQuery(raw: string): ParsedQuery {
  const out: ParsedQuery = { terms: [], raw };
  const sisa: string[] = [];

  for (const token of raw.trim().split(/\s+/).filter(Boolean)) {
    // Nilai operator boleh berkutip: subjek:"Permintaan pelatihan"
    const m = token.match(/^([a-zA-Z]+):(?:"([^"]*)"|(\S*))$/);
    const pair = m
      ? { key: m[1].toLowerCase(), value: (m[2] ?? m[3] ?? "").trim() }
      : splitToken(token);

    if (!pair || !pair.value) {
      sisa.push(token);
      continue;
    }
    switch (pair.key) {
      case "from":
        out.from = pair.value;
        break;
      case "to":
        out.to = pair.value;
        break;
      case "subjek":
      case "subject":
        out.subjek = pair.value;
        break;
      case "dengan":
        if (/lampiran|attachment|file/i.test(pair.value)) out.denganLampiran = true;
        else sisa.push(token);
        break;
      case "lampiran":
        if (/^(ya|yes|true|1)$/i.test(pair.value)) out.lampiran = true;
        else if (/^(tidak|no|tanpa|false|0)$/i.test(pair.value)) out.lampiran = false;
        else sisa.push(token);
        break;
      default:
        sisa.push(token);
    }
  }

  out.terms = sisa;
  return out;
}

function contains(value: string) {
  return { contains: value, mode: "insensitive" as const };
}

/** Bagian WHERE untuk satu kata kunci bebas. */
function termCondition(term: string): Prisma.EmailMessageWhereInput {
  return {
    OR: [
      { subject: contains(term) },
      { fromEmail: contains(term) },
      { fromName: contains(term) },
      { textBody: contains(term) },
      { preview: contains(term) },
      { toEmails: contains(term) },
      { ccEmails: contains(term) },
      { bccEmails: contains(term) },
      { attachments: { some: { filename: contains(term) } } },
    ],
  };
}

/**
 * Gabungkan filter dasar (tab + filter status) dengan hasil parser.
 * Semua kata kunci harus cocok (AND); setiap kata boleh cocok di kolom mana pun.
 */
export function buildEmailWhere(
  base: Prisma.EmailMessageWhereInput,
  query: ParsedQuery
): Prisma.EmailMessageWhereInput {
  const and: Prisma.EmailMessageWhereInput[] = [];
  for (const t of query.terms) and.push(termCondition(t));
  if (query.from) and.push({ fromEmail: contains(query.from) });
  if (query.to) and.push({ toEmails: contains(query.to) });
  if (query.subjek) and.push({ subject: contains(query.subjek) });
  if (query.denganLampiran) and.push({ hasAttachments: true });
  if (query.lampiran !== undefined) and.push({ hasAttachments: query.lampiran });

  if (and.length === 0) return base;
  return { AND: [base, ...and] };
}

/** Teks yang perlu disorot di UI (hanya kata kunci, bukan nilai operator). */
export function highlightTerms(query: ParsedQuery): string[] {
  return query.terms.filter((t) => t.length > 0);
}

/** Contoh operator untukplaceholder di kolom pencarian. */
export const SEARCH_HELP =
  "Pencarian: kata kunci (semua kata harus cocok) · from: · to: · subjek: · dengan:lampiran";
