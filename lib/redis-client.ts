/**
 * Shared Redis client for optional features (scan cache, rate limits).
 * Falls back gracefully when REDIS_URL is unset or Redis is unreachable.
 */

type RedisCommands = {
  get(key: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<unknown>;
  del(...keys: string[]): Promise<number>;
  incr(key: string): Promise<number>;
  pexpire(key: string, ms: number): Promise<number>;
  pttl(key: string): Promise<number>;
};

let redisClient: RedisCommands | null = null;
let redisInitFailed = false;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export async function getRedisClient(): Promise<RedisCommands | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url || redisInitFailed) return null;
  if (redisClient) return redisClient;

  try {
    const { default: Redis } = await import('ioredis');
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    redisClient = client as unknown as RedisCommands;
    return redisClient;
  } catch (err) {
    redisInitFailed = true;
    console.warn('[redis] unavailable:', err);
    return null;
  }
}
