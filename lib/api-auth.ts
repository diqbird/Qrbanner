import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/api-key';
import { getPlanLimits } from '@/lib/plans';
import { enforceApiRateLimit } from '@/lib/api-rate-limit';

export interface ApiAuthContext {
  userId: string;
  email: string;
  /** Rate-limit headers to echo back on successful responses. */
  rateLimitHeaders: Record<string, string>;
}

function extractApiKey(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const headerKey = req.headers.get('x-api-key');
  if (headerKey?.trim()) return headerKey.trim();
  return null;
}

export async function authenticateApiRequest(
  req: NextRequest
): Promise<ApiAuthContext | NextResponse> {
  const rawKey = extractApiKey(req);
  if (!rawKey) {
    return NextResponse.json(
      { error: 'Missing API key. Use Authorization: Bearer <key> or X-API-Key header.' },
      { status: 401 }
    );
  }

  if (!isValidApiKeyFormat(rawKey)) {
    return NextResponse.json({ error: 'Invalid API key format' }, { status: 401 });
  }

  const keyHash = hashApiKey(rawKey);
  const user = await prisma.user.findFirst({
    where: { apiKeyHash: keyHash },
    select: { id: true, email: true, plan: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const plan = getPlanLimits(user.plan);
  if (!plan.apiAccess) {
    return NextResponse.json(
      { error: `API access is not available on the ${plan.name} plan. Please upgrade.` },
      { status: 403 }
    );
  }

  const limit = await enforceApiRateLimit(user.id, plan);
  if (!limit.ok) {
    const message =
      limit.scope === 'month'
        ? `Monthly API quota exceeded (${plan.apiMonthlyQuota} requests on the ${plan.name} plan). Upgrade for a higher quota.`
        : `Rate limit exceeded (${plan.apiRateLimitPerMin} requests/min on the ${plan.name} plan). Slow down and retry.`;
    return NextResponse.json({ error: message }, { status: 429, headers: limit.headers });
  }

  return { userId: user.id, email: user.email, rateLimitHeaders: limit.headers };
}

export function isAuthError(result: ApiAuthContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export function apiError(message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ error: message }, { status, headers });
}

export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, { status, headers });
}
