export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateWebhookSecret } from '@/lib/webhooks';
import { WEBHOOK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { requireMfaStepUp } from '@/lib/mfa-recovery';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const limited = await rateLimitRequest(
    req,
    'webhook-mutation',
    WEBHOOK_LIMIT.limit,
    WEBHOOK_LIMIT.windowMs,
    userId
  );
  if (limited) return limited;

  const { id } = await params;
  const existing = await prisma.webhookEndpoint.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
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

  const secret = generateWebhookSecret();
  await prisma.webhookEndpoint.update({
    where: { id },
    data: { secret },
  });

  return NextResponse.json({
    ok: true,
    secret,
    message: 'Store this secret securely. It will not be shown again.',
  });
}
