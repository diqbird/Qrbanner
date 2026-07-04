import { NextResponse } from 'next/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit-store';

type ReqWithHeaders = { headers: { get(name: string): string | null } };

function rateLimitHeaders(limit: number, remaining: number, resetAt: number, retryAfter: number) {
  return {
    'Retry-After': String(retryAfter),
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  };
}

/** Returns 429 JSON when limited; null when allowed. Uses Redis when REDIS_URL is set. */
export async function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  error = 'rate_limited'
): Promise<NextResponse | null> {
  const result = await checkRateLimit(key, limit, windowMs);
  if (result.ok) return null;

  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error },
    {
      status: 429,
      headers: rateLimitHeaders(limit, 0, result.resetAt, retryAfter),
    }
  );
}

export async function rateLimitRequest(
  req: ReqWithHeaders,
  scope: string,
  limit: number,
  windowMs: number,
  userId?: string | null
): Promise<NextResponse | null> {
  const identity = userId?.trim() || clientIp(req);
  return enforceRateLimit(`${scope}:${identity}`, limit, windowMs, 'Too many requests. Please try again later.');
}

/** QR create/update/delete — 120 requests per 15 minutes per user */
export const QR_MUTATION_LIMIT = { limit: 120, windowMs: 15 * 60 * 1000 };

/** Bulk import — 20 requests per hour per user */
export const BULK_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };

/** AI campaign batch create — 10 per hour per user */
export const CAMPAIGN_CREATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

/** Webhook CRUD — 60 requests per 15 minutes per user */
export const WEBHOOK_LIMIT = { limit: 60, windowMs: 15 * 60 * 1000 };

/** Automation flow CRUD — 60 requests per 15 minutes per user */
export const AUTOMATION_LIMIT = { limit: 60, windowMs: 15 * 60 * 1000 };

/** Public stats — 30 requests per minute per IP */
export const PUBLIC_STATS_LIMIT = { limit: 30, windowMs: 60 * 1000 };
