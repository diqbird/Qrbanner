export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { buildAnalytics } from '@/lib/analytics-utils';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  filterScansByRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
} from '@/lib/analytics-range';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cutoff = await getUserAnalyticsCutoff(userId);
    const range = parseAnalyticsRange(req.nextUrl.searchParams, cutoff);

    const workspaceId = await getActiveWorkspaceId(userId);

    const qrCodes = await prisma.qRCode.findMany({
      where: { workspaceId },
      select: { id: true, name: true, totalScans: true, isActive: true },
    });

    const qrIds = qrCodes.map((q) => q.id);
    const nameMap = Object.fromEntries(qrCodes.map((q) => [q.id, q.name]));

    const scanWhere: { qrCodeId: { in: string[] }; scannedAt?: { gte?: Date; lte?: Date } } = {
      qrCodeId: { in: qrIds },
    };
    if (range.from || range.to) {
      scanWhere.scannedAt = {};
      if (range.from) scanWhere.scannedAt.gte = range.from;
      if (range.to) scanWhere.scannedAt.lte = range.to;
    } else if (cutoff) {
      scanWhere.scannedAt = { gte: cutoff };
    }

    const scans = await prisma.qRScan.findMany({
      where: scanWhere,
      orderBy: { scannedAt: 'desc' },
      take: 10000,
    });

    const enriched = filterScansByRange(
      scans.map((s) => ({
        ...s,
        qrName: nameMap[s.qrCodeId] ?? null,
      })),
      range
    );

    const localeParam = req.nextUrl.searchParams.get('locale');
    const locale = localeParam === 'tr' ? 'tr' : 'en';

    const analytics = buildAnalytics(enriched, 30, range, locale);

    const topQRCodes = [...qrCodes]
      .sort((a, b) => b.totalScans - a.totalScans)
      .slice(0, 5)
      .map((q) => ({ id: q.id, name: q.name, totalScans: q.totalScans, isActive: q.isActive }));

    return NextResponse.json({
      analytics,
      summary: {
        totalQRCodes: qrCodes.length,
        activeQRCodes: qrCodes.filter((q) => q.isActive).length,
        totalScans: qrCodes.reduce((sum, q) => sum + q.totalScans, 0),
      },
      topQRCodes,
      range: {
        from: range.from?.toISOString() ?? null,
        to: range.to?.toISOString() ?? null,
      },
      retentionCutoff: cutoff?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
