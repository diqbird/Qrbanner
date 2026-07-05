export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { assertSafeOutboundUrl } from '@/lib/outbound-url';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limited = await rateLimitRequest(req, 'webhook-mutation', WEBHOOK_LIMIT.limit, WEBHOOK_LIMIT.windowMs, userId);
  if (limited) return limited;

  const existing = await prisma.webhookEndpoint.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const data: { url?: string; label?: string | null; enabled?: boolean } = {};
  if (body.url != null) {
    const urlCheck = assertSafeOutboundUrl(String(body.url).trim());
    if (!urlCheck.ok) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400 });
    }
    data.url = urlCheck.url;
  }
  if (body.label !== undefined) data.label = body.label ? String(body.label).trim() : null;
  if (typeof body.enabled === 'boolean') data.enabled = body.enabled;

  const updated = await prisma.webhookEndpoint.update({
    where: { id: params.id },
    data,
    select: { id: true, url: true, label: true, enabled: true, updatedAt: true },
  });

  return NextResponse.json({ webhook: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limited = await rateLimitRequest(req, 'webhook-mutation', WEBHOOK_LIMIT.limit, WEBHOOK_LIMIT.windowMs, userId);
  if (limited) return limited;

  const existing = await prisma.webhookEndpoint.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.webhookEndpoint.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
