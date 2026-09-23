import { randomBytes, createHash } from "node:crypto";

/** Generate raw token (hex 64) and its SHA256 hash for DB storage. */
export function generateResetToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex"); // 64 chars, 256-bit
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function isExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() <= Date.now();
}
