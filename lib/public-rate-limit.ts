import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit-store';

type RateLimitBody = Record<string, unknown>;

/** Returns 429 when limited; null when allowed. */
export async function enforcePublicRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
  body: RateLimitBody = { error: 'rate_limited' }
): Promise<NextResponse | null> {
  const result = await checkRateLimit(`${scope}:${clientIp(req)}`, limit, windowMs);
  if (result.ok) return null;
  return NextResponse.json(body, { status: 429 });
}
