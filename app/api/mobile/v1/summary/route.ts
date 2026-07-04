export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';

export async function GET(req: NextRequest) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const workspaceId = await getActiveWorkspaceId(auth.userId);
  const access = await assertWorkspaceRole(auth.userId, workspaceId, 'viewer');
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: 403, headers: auth.rateLimitHeaders });
  }

  const usage = await getUserPlanUsage(auth.userId);

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [activeQr, scans24h, totalScansAgg, recentScans] = await Promise.all([
    prisma.qRCode.count({ where: { workspaceId, isActive: true } }),
    prisma.qRScan.count({
      where: {
        qrCode: { workspaceId },
        scannedAt: { gte: since24h },
      },
    }),
    prisma.qRCode.aggregate({
      where: { workspaceId },
      _sum: { totalScans: true },
    }),
    prisma.qRScan.findMany({
      where: { qrCode: { workspaceId } },
      orderBy: { scannedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        scannedAt: true,
        country: true,
        city: true,
        device: true,
        qrCode: { select: { id: true, name: true, shortCode: true } },
      },
    }),
  ]);

  return NextResponse.json(
    {
      plan: usage.plan.id,
      planName: usage.plan.name,
      totals: {
        qrCodes: usage.qrCodes,
        qrLimit: usage.qrLimit,
        activeQr,
        totalScans: totalScansAgg._sum.totalScans ?? 0,
        scans24h,
      },
      recentScans: recentScans.map((s) => ({
        id: s.id,
        scannedAt: s.scannedAt.toISOString(),
        country: s.country,
        city: s.city,
        device: s.device,
        qr: s.qrCode,
      })),
      auth: auth.via,
    },
    { headers: auth.rateLimitHeaders }
  );
}
