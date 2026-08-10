/**
 * Simple in-memory rate limiter.
 *
 * LIMITATION: State is per Node.js process only. In multi-instance or serverless
 * deployments each instance maintains its own counters — effective limits are
 * multiplied by instance count. Replace with Redis/Upstash for production scale.
 */

export interface RateLimitConfig {
  /** Unique bucket key, e.g. `login:email:user@example.com` */
  key: string;
  /** Maximum attempts within the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpired(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const existing = store.get(config.key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(config.key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt: new Date(resetAt),
      retryAfterMs: 0,
    };
  }

  if (existing.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(existing.resetAt),
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: config.limit - existing.count,
    resetAt: new Date(existing.resetAt),
    retryAfterMs: 0,
  };
}

export function assertRateLimit(config: RateLimitConfig): void {
  const result = checkRateLimit(config);
  if (!result.allowed) {
    throw new RateLimitError("Too many requests", result);
  }
}

export class RateLimitError extends Error {
  readonly result: RateLimitResult;

  constructor(message: string, result: RateLimitResult) {
    super(message);
    this.name = "RateLimitError";
    this.result = result;
  }
}

/** Presets for common Finekarts endpoints. */
export const RATE_LIMITS = {
  login: { limit: 10, windowMs: 15 * 60 * 1000 },
  otp: { limit: 5, windowMs: 15 * 60 * 1000 },
  ai: { limit: 30, windowMs: 60 * 1000 },
} as const;

export function rateLimitKey(scope: keyof typeof RATE_LIMITS, identifier: string): string {
  return `${scope}:${identifier}`;
}
