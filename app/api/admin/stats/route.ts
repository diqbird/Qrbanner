export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import {
  estimatedMrr,
  planCountsFromGroupBy,
  premiumUserCount,
} from '@/lib/admin-billing-stats';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const [totalUsers, byPlan, byRole, qrTotal, scanTotal, last7Days, paddleSubscribers, paddleByPlan] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ['plan'], _count: { id: true } }),
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      prisma.qRCode.count(),
      prisma.qRScan.count(),
      prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.user.count({
        where: { paddleSubscriptionId: { not: null } },
      }),
      prisma.user.groupBy({
        by: ['plan'],
        where: {
          paddleSubscriptionId: { not: null },
          plan: { in: ['pro', 'business', 'agency'] },
        },
        _count: { id: true },
      }),
    ]);

  const planCounts = planCountsFromGroupBy(byPlan);
  const paddlePlanCounts = planCountsFromGroupBy(paddleByPlan);

  return NextResponse.json({
    totalUsers,
    planCounts,
    byRole: byRole.map((r) => ({ role: r.role, count: r._count.id })),
    qrTotal,
    scanTotal,
    signupsLast7Days: last7Days,
    premiumUsers: premiumUserCount(planCounts),
    paddleSubscribers,
    estimatedMrr: estimatedMrr(paddlePlanCounts),
  });
}
