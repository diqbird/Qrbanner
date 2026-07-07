export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { estimatedMrr, planCountsFromGroupBy } from '@/lib/admin-billing-stats';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const [events, paddleByPlan, paddleSubscribers] = await Promise.all([
    prisma.billingWebhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.user.groupBy({
      by: ['plan'],
      where: {
        paddleSubscriptionId: { not: null },
        plan: { in: ['pro', 'business', 'agency'] },
      },
      _count: { id: true },
    }),
    prisma.user.count({ where: { paddleSubscriptionId: { not: null } } }),
  ]);

  const paddlePlanCounts = planCountsFromGroupBy(paddleByPlan);

  return NextResponse.json({
    estimatedMrr: estimatedMrr(paddlePlanCounts),
    paddleSubscribers,
    webhookEvents: events,
  });
}
