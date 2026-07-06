export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchAggregatedAnalytics } from '@/lib/analytics-aggregation';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  getPreviousPeriodRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
  earliestAnalyticsFetchDate,
} from '@/lib/analytics-range';
import { buildFunnelMetrics } from '@/lib/analytics-funnel';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const cutoff = await getUserAnalyticsCutoff(userId);
    const range = parseAnalyticsRange(req.nextUrl.searchParams, cutoff);

    const workspaceId = await getActiveWorkspaceId(userId);

    const qrCodes = await prisma.qRCode.findMany({
      where: { workspaceId },
      select: { id: true, name: true, totalScans: true, isActive: true },
    });

    const qrIds = qrCodes.map((q) => q.id);
    const nameMap = Object.fromEntries(qrCodes.map((q) => [q.id, q.name]));

    const prevRange = getPreviousPeriodRange(range);
    const fetchFrom = earliestAnalyticsFetchDate(range, cutoff);
    const localeParam = req.nextUrl.searchParams.get('locale');
    const locale = localeParam === 'tr' ? 'tr' : 'en';

    const analytics = await fetchAggregatedAnalytics({
      qrCodeIds: qrIds,
      range,
      nameMap,
      locale,
    });

    const periodComparison = prevRange
      ? buildPeriodComparison(
          analytics,
          await fetchAggregatedAnalytics({
            qrCodeIds: qrIds,
            range: prevRange,
            nameMap,
            locale,
          }),
        )
      : null;

    const dateFilter =
      fetchFrom || range.to
        ? {
            ...(fetchFrom ? { gte: fetchFrom } : {}),
            ...(range.to ? { lte: range.to } : {}),
          }
        : cutoff
          ? { gte: cutoff }
          : undefined;

    const [ctaClicks, leadsCount] = await Promise.all([
      qrIds.length
        ? prisma.landingCtaClick.count({
            where: {
              qrCodeId: { in: qrIds },
              ...(dateFilter ? { clickedAt: dateFilter } : {}),
            },
          })
        : Promise.resolve(0),
      qrIds.length
        ? prisma.leadSubmission.count({
            where: {
              qrCodeId: { in: qrIds },
              ...(dateFilter ? { createdAt: dateFilter } : {}),
            },
          })
        : Promise.resolve(0),
    ]);

    const hasLandingQr = await prisma.qRCode.count({
      where: { workspaceId, landingPageEnabled: true },
    });

    const funnel = buildFunnelMetrics({
      scans: analytics.totalScans,
      ctaClicks,
      leads: leadsCount,
      landingEnabled: hasLandingQr > 0,
    });

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
      funnel,
      periodComparison,
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
