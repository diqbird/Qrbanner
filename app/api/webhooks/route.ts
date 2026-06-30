export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { generateWebhookSecret } from '@/lib/webhooks';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      label: true,
      enabled: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const usage = await getUserPlanUsage(userId);
  return NextResponse.json({
    webhooks: endpoints,
    limit: usage.plan.maxWebhooks,
    count: endpoints.length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limited = await rateLimitRequest(req, 'webhook-mutation', WEBHOOK_LIMIT.limit, WEBHOOK_LIMIT.windowMs, userId);
  if (limited) return limited;

  const usage = await getUserPlanUsage(userId);
  const count = await prisma.webhookEndpoint.count({ where: { userId } });
  if (count >= usage.plan.maxWebhooks) {
    return NextResponse.json(
      { error: `Webhook limit reached (${usage.plan.maxWebhooks} on ${usage.plan.name} plan).` },
      { status: 403 }
    );
  }

  const body = await req.json();
  const url = String(body.url ?? '').trim();
  const label = body.label ? String(body.label).trim() : null;

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: 'A valid HTTPS URL is required.' }, { status: 400 });
  }

  const secret = generateWebhookSecret();
  const endpoint = await prisma.webhookEndpoint.create({
    data: { userId, url, label, secret },
    select: { id: true, url: true, label: true, enabled: true, createdAt: true },
  });

  return NextResponse.json({ webhook: endpoint, secret });
}
