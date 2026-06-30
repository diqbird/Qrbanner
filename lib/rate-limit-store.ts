/**
 * Rate limiting with optional Redis (REDIS_URL) and in-memory fallback.
 * Use checkRateLimit() in API routes for consistent behaviour across instances.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

type RedisClient = {
  incr(key: string): Promise<number>;
  pexpire(key: string, ms: number): Promise<number>;
  pttl(key: string): Promise<number>;
};

let redisClient: RedisClient | null = null;
let redisInitFailed = false;

async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url || redisInitFailed) return null;
  if (redisClient) return redisClient;

  try {
    const { default: Redis } = await import('ioredis');
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    redisClient = client as unknown as RedisClient;
    return redisClient;
  } catch (err) {
    redisInitFailed = true;
    console.warn('[rate-limit] Redis unavailable, using in-memory fallback:', err);
    return null;
  }
}

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const redis = await getRedis();
  if (!redis) {
    return memoryRateLimit(key, limit, windowMs);
  }

  const redisKey = `rl:${key}`;
  try {
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, windowMs);
    }
    const ttl = await redis.pttl(redisKey);
    const resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);
    if (count > limit) {
      return { ok: false, remaining: 0, resetAt };
    }
    return { ok: true, remaining: Math.max(0, limit - count), resetAt };
  } catch {
    return memoryRateLimit(key, limit, windowMs);
  }
}

export function clientIp(req: { headers: { get(name: string): string | null } }): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

/** @deprecated Use checkRateLimit for new code */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  return memoryRateLimit(key, limit, windowMs);
}
