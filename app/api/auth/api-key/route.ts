export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { generateApiKey, hashApiKey, getApiKeyPrefix } from '@/lib/api-key';
import { getPlanLimits } from '@/lib/plans';
import { getApiUsage } from '@/lib/api-rate-limit';

async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string })?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKeyHash: true, apiKeyPrefix: true, apiKeyCreatedAt: true, plan: true },
    });

    const plan = getPlanLimits(user?.plan ?? 'free');
    const usage = await getApiUsage(userId, plan);

    return NextResponse.json({
      has_key: Boolean(user?.apiKeyHash),
      prefix: user?.apiKeyPrefix ?? null,
      created_at: user?.apiKeyCreatedAt?.toISOString() ?? null,
      plan: plan.id,
      plan_name: plan.name,
      api_access: plan.apiAccess,
      usage: {
        per_minute_limit: usage.perMinuteLimit,
        monthly_quota: usage.monthlyQuota,
        monthly_used: usage.monthlyUsed,
        monthly_remaining: usage.monthlyRemaining,
        monthly_reset_at: usage.monthlyResetAt,
      },
    });
  } catch (error) {
    console.error('API key status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);
    const prefix = getApiKeyPrefix(rawKey);

    await prisma.user.update({
      where: { id: userId },
      data: {
        apiKeyHash: keyHash,
        apiKeyPrefix: prefix,
        apiKeyCreatedAt: new Date(),
      },
    });

    return NextResponse.json({
      api_key: rawKey,
      prefix,
      message: 'Store this key securely. It will not be shown again.',
    });
  } catch (error) {
    console.error('API key create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.user.update({
      where: { id: userId },
      data: {
        apiKeyHash: null,
        apiKeyPrefix: null,
        apiKeyCreatedAt: null,
      },
    });

    return NextResponse.json({ message: 'API key revoked' });
  } catch (error) {
    console.error('API key revoke error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
