export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';
import {
  estimatedMrr,
  planCountsFromGroupBy,
  premiumUserCount,
} from '@/lib/admin-billing-stats';

export async function GET() {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [totalUsers, byPlan, byRole, qrTotal, scanTotal, last7Days, stripeSubscribers] =
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
        where: { stripeSubscriptionId: { not: null } },
      }),
    ]);

  const planCounts = planCountsFromGroupBy(byPlan);

  return NextResponse.json({
    totalUsers,
    planCounts,
    byRole: byRole.map((r) => ({ role: r.role, count: r._count.id })),
    qrTotal,
    scanTotal,
    signupsLast7Days: last7Days,
    premiumUsers: premiumUserCount(planCounts),
    stripeSubscribers,
    estimatedMrr: estimatedMrr(planCounts),
  });
}
