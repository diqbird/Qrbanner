export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { AUTOMATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { sanitizeAutomationFlow } from '@/lib/automation-sanitize';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const flows = await prisma.automationFlow.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      enabled: true,
      trigger: true,
      qrCodeId: true,
      conditions: true,
      actions: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const usage = await getUserPlanUsage(userId);
  return NextResponse.json({
    flows,
    limit: usage.plan.maxAutomations,
    count: flows.length,
  });
}

export async function POST(req: NextRequest) {
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

  const usage = await getUserPlanUsage(userId);
  const count = await prisma.automationFlow.count({ where: { userId } });
  if (count >= usage.plan.maxAutomations) {
    return NextResponse.json(
      { error: `Automation limit reached (${usage.plan.maxAutomations} on ${usage.plan.name} plan).` },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const plan = sanitizeAutomationFlow(body);
  if (!plan) {
    return NextResponse.json({ error: 'Invalid automation flow' }, { status: 400 });
  }

  if (plan.qrCodeId) {
    const qr = await prisma.qRCode.findFirst({
      where: { id: plan.qrCodeId, userId },
      select: { id: true },
    });
    if (!qr) return NextResponse.json({ error: 'QR code not found' }, { status: 400 });
  }

  const flow = await prisma.automationFlow.create({
    data: {
      userId,
      name: plan.name,
      enabled: plan.enabled,
      trigger: plan.trigger,
      qrCodeId: plan.qrCodeId ?? null,
      conditions: plan.conditions as object,
      actions: plan.actions as object,
    },
    select: {
      id: true,
      name: true,
      enabled: true,
      trigger: true,
      qrCodeId: true,
      conditions: true,
      actions: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ flow });
}
