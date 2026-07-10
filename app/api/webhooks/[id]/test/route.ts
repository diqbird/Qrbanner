export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { deliverWebhookPayload } from '@/lib/webhook-dispatch';
import { buildTestScanWebhookPayload } from '@/lib/webhook-test-payload';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limited = await rateLimitRequest(
    req,
    'webhook-mutation',
    WEBHOOK_LIMIT.limit,
    WEBHOOK_LIMIT.windowMs,
    userId
  );
  if (limited) return limited;

  const { id } = await params;
  const endpoint = await prisma.webhookEndpoint.findFirst({
    where: { id, userId },
    select: { id: true, url: true, secret: true, enabled: true },
  });

  if (!endpoint) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const payload = buildTestScanWebhookPayload();
  const body = JSON.stringify(payload);

  const result = await deliverWebhookPayload({
    endpoint,
    userId,
    event: 'scan.test',
    body,
    payload: { ...payload, test: true },
  });

  return NextResponse.json({
    success: result.success,
    statusCode: result.statusCode,
    error: result.error,
    durationMs: result.durationMs,
  });
}
