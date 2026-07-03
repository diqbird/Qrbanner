import { NextResponse } from 'next/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit-store';

type ReqWithHeaders = { headers: { get(name: string): string | null } };

export async function rateLimitRequest(
  req: ReqWithHeaders,
  scope: string,
  limit: number,
  windowMs: number,
  userId?: string | null
): Promise<NextResponse | null> {
  const identity = userId?.trim() || clientIp(req);
  const result = await checkRateLimit(`${scope}:${identity}`, limit, windowMs);
  if (result.ok) return null;

  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
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
