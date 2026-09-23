/**
 * Simple in-memory rate limiter (per-key sliding window).
 * Cold start resets — acceptable for managed hosting; DB count is the real guard.
 */
const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = buckets.get(key) ?? [];
  const fresh = arr.filter((t) => now - t < windowMs);
  if (fresh.length >= limit) {
    buckets.set(key, fresh);
    return true;
  }
  fresh.push(now);
  buckets.set(key, fresh);
  return false;
}

/** Optional cleanup to avoid unbounded growth. */
export function pruneRateLimitBuckets() {
  const now = Date.now();
  for (const [k, arr] of buckets) {
    const fresh = arr.filter((t) => now - t < 60 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(k);
    else buckets.set(k, fresh);
  }
}
