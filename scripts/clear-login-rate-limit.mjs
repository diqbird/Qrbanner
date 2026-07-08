#!/usr/bin/env node
/**
 * Clear login rate-limit keys from Redis so a locked-out user can retry.
 * Safe: only deletes keys under rl:auth:login*.
 * Usage: node scripts/clear-login-rate-limit.mjs
 */
const url = process.env.REDIS_URL?.trim();
if (!url) {
  console.log('CLEAR: no REDIS_URL — rate limit is in-memory; pm2 restart clears it.');
  process.exit(0);
}

const { default: Redis } = await import('ioredis');
const redis = new Redis(url, { maxRetriesPerRequest: 2 });

try {
  const patterns = ['rl:auth:login*', 'rl:auth:login-email*'];
  let deleted = 0;
  for (const pattern of patterns) {
    let cursor = '0';
    do {
      const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
      cursor = next;
      if (keys.length) {
        deleted += await redis.del(...keys);
      }
    } while (cursor !== '0');
  }
  console.log('CLEAR deletedKeys=', deleted);
} finally {
  redis.disconnect();
}
