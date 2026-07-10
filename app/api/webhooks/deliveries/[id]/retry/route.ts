export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { deliverWebhookPayload } from '@/lib/webhook-dispatch';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const { id } = await params;
  const delivery = await prisma.webhookDelivery.findFirst({
    where: { id, userId },
    include: { endpoint: { select: { id: true, url: true, secret: true, enabled: true } } },
  });

  if (!delivery) {
    return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
  }
  if (!delivery.payload || typeof delivery.payload !== 'object') {
    return NextResponse.json({ error: 'No payload stored for retry' }, { status: 400 });
  }
  if (!delivery.endpoint?.enabled) {
    return NextResponse.json({ error: 'Webhook endpoint is disabled' }, { status: 400 });
  }

  const body = JSON.stringify(delivery.payload);
  const result = await deliverWebhookPayload({
    endpoint: delivery.endpoint,
    userId,
    event: delivery.event,
    body,
    payload: delivery.payload as object,
    attemptOffset: delivery.attempt,
  });

  return NextResponse.json({
    success: result.success,
    statusCode: result.statusCode,
    error: result.error,
    durationMs: result.durationMs,
  });
}
