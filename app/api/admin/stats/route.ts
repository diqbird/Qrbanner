export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';

export async function GET() {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [totalUsers, byPlan, byRole, qrTotal, scanTotal, last7Days] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ['plan'], _count: { id: true } }),
    prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
    prisma.qRCode.count(),
    prisma.qRScan.count(),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const planCounts = { free: 0, pro: 0, business: 0 };
  for (const row of byPlan) {
    const key = row.plan as keyof typeof planCounts;
    if (key in planCounts) planCounts[key] = row._count.id;
  }

  return NextResponse.json({
    totalUsers,
    planCounts,
    byRole: byRole.map((r) => ({ role: r.role, count: r._count.id })),
    qrTotal,
    scanTotal,
    signupsLast7Days: last7Days,
    premiumUsers: planCounts.pro + planCounts.business,
  });
}
