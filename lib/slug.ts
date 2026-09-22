// Util slug — dipakai untuk kategori & program.
// "Kelas Komputer" → "kelas-komputer", "Desain Grafis" → "desain-grafis"

/** ASCII-safe, lowercase, dipisah tanda hubung. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // buang aksen
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Cari slug unik: "tata-boga", lalu "tata-boga-2", "tata-boga-3", ...
 * `exists` harus mengembalikan true bila slug sudah dipakai.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
  excludeId?: number,
  getOwnerId?: (slug: string) => Promise<number | null>
): Promise<string> {
  const root = slugify(base) || "kategori";
  let candidate = root;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const taken = await exists(candidate);
    if (!taken) return candidate;
    if (excludeId && getOwnerId) {
      const ownerId = await getOwnerId(candidate);
      if (ownerId === excludeId) return candidate; // slug milik record yang sedang diedit
    }
    i += 1;
    candidate = `${root}-${i}`;
  }
}
