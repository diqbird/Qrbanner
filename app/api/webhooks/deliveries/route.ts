export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { listWebhookDeliveries } from '@/lib/webhook-deliveries';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
      createdAt: row.createdAt.toISOString(),
    })),
  });
}
