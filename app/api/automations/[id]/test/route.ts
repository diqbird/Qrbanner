export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AUTOMATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { testAutomationFlow } from '@/lib/automation-engine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limited = await rateLimitRequest(
    req,
    'automation-mutation',
    AUTOMATION_LIMIT.limit,
    AUTOMATION_LIMIT.windowMs,
    userId
  );
  if (limited) return limited;

  const existing = await prisma.automationFlow.findFirst({
    where: { id: params.id, userId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const result = await testAutomationFlow(userId, params.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });

  return NextResponse.json({
    success: result.success,
    error: result.error,
  });
}
