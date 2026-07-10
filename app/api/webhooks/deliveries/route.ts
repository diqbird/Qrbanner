export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { listWebhookDeliveries } from '@/lib/webhook-deliveries';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const endpointId = req.nextUrl.searchParams.get('endpointId') ?? undefined;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '25', 10) || 25;

  const deliveries = await listWebhookDeliveries(userId, { endpointId, limit });

  return NextResponse.json({
    deliveries: deliveries.map((row) => ({
      id: row.id,
      endpointId: row.endpointId,
      endpointUrl: row.endpoint?.url ?? null,
      endpointLabel: row.endpoint?.label ?? null,
      event: row.event,
      statusCode: row.statusCode,
      success: row.success,
      error: row.error,
      durationMs: row.durationMs,
      attempt: row.attempt,
      canRetry: Boolean(row.payload),
      createdAt: row.createdAt.toISOString(),
    })),
  });
}
