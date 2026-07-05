export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limit = Math.min(50, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10)));

  const logs = await prisma.automationLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      flowId: true,
      trigger: true,
      success: true,
      error: true,
      createdAt: true,
      flow: { select: { name: true } },
    },
  });

  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      flowId: l.flowId,
      flowName: l.flow.name,
      trigger: l.trigger,
      success: l.success,
      error: l.error,
      createdAt: l.createdAt,
    })),
  });
}
