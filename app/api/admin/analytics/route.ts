export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    scans30d,
    scans7d,
    topQr,
    scansByDay,
    leads30d,
    ctaClicks30d,
  ] = await Promise.all([
    prisma.qRScan.count({ where: { scannedAt: { gte: thirtyDaysAgo } } }),
    prisma.qRScan.count({ where: { scannedAt: { gte: sevenDaysAgo } } }),
    prisma.qRCode.findMany({
      orderBy: { scans: { _count: 'desc' } },
      take: 10,
      select: { id: true, name: true, shortCode: true, _count: { select: { scans: true } } },
    }),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "scannedAt") AS day, COUNT(*)::bigint AS count
      FROM "QRScan"
      WHERE "scannedAt" >= ${sevenDaysAgo}
      GROUP BY 1 ORDER BY 1
    `,
    prisma.leadSubmission.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.landingCtaClick.count({ where: { clickedAt: { gte: thirtyDaysAgo } } }),
  ]);

  return NextResponse.json({
    scansLast30Days: scans30d,
    scansLast7Days: scans7d,
    leadsLast30Days: leads30d,
    ctaClicksLast30Days: ctaClicks30d,
    topQrCodes: topQr.map((q) => ({
      id: q.id,
      name: q.name,
      shortCode: q.shortCode,
      scans: q._count.scans,
    })),
    scansByDay: scansByDay.map((r) => ({
      day: r.day,
      count: Number(r.count),
    })),
  });
}
