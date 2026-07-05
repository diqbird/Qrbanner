export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AUTOMATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { sanitizeAutomationFlow } from '@/lib/automation-sanitize';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function PATCH(
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
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};

  if (body.enabled !== undefined) update.enabled = Boolean(body.enabled);

  if (body.name !== undefined || body.trigger !== undefined || body.actions !== undefined) {
    const merged = sanitizeAutomationFlow({
      name: body.name ?? existing.name,
      enabled: body.enabled ?? existing.enabled,
      trigger: body.trigger ?? existing.trigger,
      qrCodeId: body.qrCodeId !== undefined ? body.qrCodeId : existing.qrCodeId,
      conditions: body.conditions ?? existing.conditions,
      actions: body.actions ?? existing.actions,
    });
    if (!merged) return NextResponse.json({ error: 'Invalid automation flow' }, { status: 400 });
    if (merged.qrCodeId) {
      const qr = await prisma.qRCode.findFirst({
        where: { id: merged.qrCodeId, userId },
        select: { id: true },
      });
      if (!qr) return NextResponse.json({ error: 'QR code not found' }, { status: 400 });
    }
    Object.assign(update, {
      name: merged.name,
      trigger: merged.trigger,
      qrCodeId: merged.qrCodeId ?? null,
      conditions: merged.conditions,
      actions: merged.actions,
    });
  }

  const flow = await prisma.automationFlow.update({
    where: { id: params.id },
    data: update,
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

export async function DELETE(
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

  await prisma.automationFlow.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
