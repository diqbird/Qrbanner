export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateWebhookSecret } from '@/lib/webhooks';
import { assertSafeOutboundUrl } from '@/lib/outbound-url';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { requireMfaStepUp } from '@/lib/mfa-recovery';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

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
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

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
  const mfaCode =
    typeof body.mfaCode === 'string'
      ? body.mfaCode
      : typeof body.mfa_code === 'string'
        ? body.mfa_code
        : typeof body.code === 'string'
          ? body.code
          : '';
  const mfa = await requireMfaStepUp(userId, mfaCode);
  if (!mfa.ok) return NextResponse.json({ error: mfa.error }, { status: mfa.status });

  const urlRaw = String(body.url ?? '').trim();
  const label = body.label ? String(body.label).trim() : null;

  const urlCheck = assertSafeOutboundUrl(urlRaw);
  if (!urlCheck.ok) {
    return NextResponse.json({ error: urlCheck.error }, { status: 400 });
  }

  const secret = generateWebhookSecret();
  const endpoint = await prisma.webhookEndpoint.create({
    data: { userId, url: urlCheck.url, label, secret },
    select: { id: true, url: true, label: true, enabled: true, createdAt: true },
  });

  return NextResponse.json({ webhook: endpoint, secret });
}
