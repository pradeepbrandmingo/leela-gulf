/**
 * Rate limiter abstraction.
 *
 * `MemoryRateLimiter` is a simple fixed-window counter, fine for local
 * development and single-instance demos. It intentionally implements the
 * same `RateLimiter` interface a Redis/Upstash-backed limiter would, so
 * swapping it out in production is a one-line change (see
 * `getRateLimiter()` below) — nothing else in the codebase needs to know
 * which backend is in use.
 *
 * Production note: a single Node process's memory is NOT shared across
 * serverless instances or horizontal replicas, so this in-memory
 * implementation only rate-limits within one running process. Point
 * `RATE_LIMIT_REDIS_URL` at an Upstash/Redis instance and implement
 * `RedisRateLimiter` (stubbed below) before deploying with more than one
 * instance.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // epoch ms
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

interface Window {
  count: number;
  resetAt: number;
}

export class MemoryRateLimiter implements RateLimiter {
  private windows = new Map<string, Window>();

  constructor(private readonly limit: number, private readonly windowMs: number) {}

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.windows.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.windows.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.limit - 1, limit: this.limit, resetAt };
    }

    if (existing.count >= this.limit) {
      return { allowed: false, remaining: 0, limit: this.limit, resetAt: existing.resetAt };
    }

    existing.count += 1;
    return { allowed: true, remaining: this.limit - existing.count, limit: this.limit, resetAt: existing.resetAt };
  }
}

/**
 * Stub showing the intended production shape. Wire this up to
 * @upstash/redis or ioredis and swap it in getRateLimiter() below —
 * everything else in the app depends only on the RateLimiter interface.
 */
export class RedisRateLimiter implements RateLimiter {
  constructor(_redisUrl: string, private readonly limit: number, private readonly windowMs: number) {
    // e.g. this.redis = new Redis(redisUrl)
  }

  async check(_key: string): Promise<RateLimitResult> {
    throw new Error(
      "RedisRateLimiter is not implemented in this demo. Configure RATE_LIMIT_REDIS_URL and " +
        "implement this class (e.g. with @upstash/redis) before running multiple instances in production."
    );
  }
}

let singleton: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (singleton) return singleton;

  const limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 20);
  const windowMs = 60_000;

  singleton =
    process.env.RATE_LIMIT_REDIS_URL != null
      ? new RedisRateLimiter(process.env.RATE_LIMIT_REDIS_URL, limit, windowMs)
      : new MemoryRateLimiter(limit, windowMs);

  return singleton;
}

/** Best-effort client IP extraction behind common proxies/load balancers. */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
