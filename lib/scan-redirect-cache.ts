import type { QRCode } from '@prisma/client';
import { getRedisClient, isRedisConfigured } from '@/lib/redis-client';
import { findQrByShortCode, getShortCodesByIds } from '@/lib/repositories/qr-repository';

const CACHE_PREFIX = 'scan:qr:';
const DEFAULT_TTL_SECONDS = 120;

function cacheTtlSeconds(): number {
  const raw = parseInt(process.env.SCAN_CACHE_TTL_SECONDS ?? '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TTL_SECONDS;
}

function cacheKey(shortCode: string): string {
  return `${CACHE_PREFIX}${shortCode}`;
}

function serializeQr(qr: QRCode): string {
  return JSON.stringify({
    ...qr,
    expiresAt: qr.expiresAt?.toISOString() ?? null,
    createdAt: qr.createdAt.toISOString(),
    updatedAt: qr.updatedAt.toISOString(),
  });
}

function deserializeQr(raw: string): QRCode | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.id !== 'string') {
      return null;
    }
    return {
      ...(parsed as QRCode),
      expiresAt: parsed.expiresAt ? new Date(String(parsed.expiresAt)) : null,
      createdAt: new Date(String(parsed.createdAt)),
      updatedAt: new Date(String(parsed.updatedAt)),
    };
  } catch {
    return null;
  }
}

export async function getCachedQrByShortCode(shortCode: string): Promise<QRCode | null> {
  const redis = await getRedisClient();
  if (!redis) return null;

  const raw = await redis.get(cacheKey(shortCode));
  if (!raw) return null;
  return deserializeQr(raw);
}

export async function setCachedQrByShortCode(shortCode: string, qr: QRCode): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;

  await redis.setex(cacheKey(shortCode), cacheTtlSeconds(), serializeQr(qr));
}

export async function invalidateScanQrCache(shortCode?: string | null): Promise<void> {
  if (!shortCode) return;
  const redis = await getRedisClient();
  if (!redis) return;

  try {
    await redis.del(cacheKey(shortCode));
  } catch (err) {
    console.warn('[scan-cache] invalidate failed', err);
  }
}

export async function invalidateScanQrCaches(shortCodes: string[]): Promise<void> {
  const unique = Array.from(new Set(shortCodes.filter(Boolean)));
  if (!unique.length) return;

  const redis = await getRedisClient();
  if (!redis) return;

  try {
    await redis.del(...unique.map(cacheKey));
  } catch (err) {
    console.warn('[scan-cache] bulk invalidate failed', err);
  }
}

export async function invalidateScanQrCacheForIds(qrIds: string[]): Promise<void> {
  if (!qrIds.length) return;

  const rows = await getShortCodesByIds(qrIds);
  await invalidateScanQrCaches(rows.map((row) => row.shortCode));
}

/** Load QR for /s/[code] — Redis when configured, otherwise Postgres. */
export async function getQrForScan(shortCode: string): Promise<QRCode | null> {
  if (!shortCode) return null;

  if (isRedisConfigured()) {
    try {
      const cached = await getCachedQrByShortCode(shortCode);
      if (cached) return cached;
    } catch (err) {
      console.warn('[scan-cache] read failed, falling back to DB', err);
    }
  }

  const qr = await findQrByShortCode(shortCode);
  if (qr && isRedisConfigured()) {
    setCachedQrByShortCode(shortCode, qr).catch((err) => {
      console.warn('[scan-cache] write failed', err);
    });
  }

  return qr;
}
