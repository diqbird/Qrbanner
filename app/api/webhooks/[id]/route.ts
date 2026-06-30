export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limited = await rateLimitRequest(req, 'webhook-mutation', WEBHOOK_LIMIT.limit, WEBHOOK_LIMIT.windowMs, userId);
  if (limited) return limited;

  const existing = await prisma.webhookEndpoint.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const data: { url?: string; label?: string | null; enabled?: boolean } = {};
  if (body.url != null) {
    const url = String(body.url).trim();
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    data.url = url;
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
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limited = await rateLimitRequest(req, 'webhook-mutation', WEBHOOK_LIMIT.limit, WEBHOOK_LIMIT.windowMs, userId);
  if (limited) return limited;

  const existing = await prisma.webhookEndpoint.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.webhookEndpoint.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
