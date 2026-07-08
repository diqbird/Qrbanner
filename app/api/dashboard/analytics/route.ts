export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchAggregatedAnalytics, fetchTopQrByPeriod } from '@/lib/analytics-aggregation';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  getPreviousPeriodRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
  earliestAnalyticsFetchDate,
} from '@/lib/analytics-range';
import { buildFunnelMetrics, buildFunnelComparison } from '@/lib/analytics-funnel';
import { fetchFunnelEventCounts } from '@/lib/analytics-funnel-inputs';
import { requireUserId, isAuthError } from '@/lib/session-auth';

function buildDateFilter(
  fetchFrom: Date | null,
  range: { from: Date | null; to: Date | null },
  cutoff: Date | null,
) {
  if (fetchFrom || range.to) {
    return {
      ...(fetchFrom ? { gte: fetchFrom } : {}),
      ...(range.to ? { lte: range.to } : {}),
    };
  }
  if (cutoff) return { gte: cutoff };
  return undefined;
}

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

    const previousAnalytics = prevRange
      ? await fetchAggregatedAnalytics({
          qrCodeIds: qrIds,
          range: prevRange,
          nameMap,
          locale,
        })
      : null;

    const periodComparison = previousAnalytics
      ? buildPeriodComparison(analytics, previousAnalytics)
      : null;

    const dateFilter = buildDateFilter(fetchFrom, range, cutoff);
    const prevFetchFrom = prevRange ? earliestAnalyticsFetchDate(prevRange, cutoff) : null;
    const prevDateFilter = prevRange
      ? buildDateFilter(prevFetchFrom, prevRange, cutoff)
      : undefined;

    const [{ ctaClicks, leads: leadsCount }, prevFunnelEvents] = await Promise.all([
      fetchFunnelEventCounts(qrIds, dateFilter),
      prevRange
        ? fetchFunnelEventCounts(qrIds, prevDateFilter)
        : Promise.resolve({ ctaClicks: 0, leads: 0 }),
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

    const funnelComparison =
      previousAnalytics && prevRange
        ? buildFunnelComparison(
            funnel,
            buildFunnelMetrics({
              scans: previousAnalytics.totalScans,
              ctaClicks: prevFunnelEvents.ctaClicks,
              leads: prevFunnelEvents.leads,
              landingEnabled: hasLandingQr > 0,
            }),
          )
        : null;

    const topQRCodes = await fetchTopQrByPeriod({ qrCodes, range });

    return NextResponse.json({
      analytics,
      scansByDayPrevious: previousAnalytics?.scansByDay ?? null,
      summary: {
        totalQRCodes: qrCodes.length,
        activeQRCodes: qrCodes.filter((q) => q.isActive).length,
        totalScans: qrCodes.reduce((sum, q) => sum + q.totalScans, 0),
      },
      topQRCodes,
      funnel,
      funnelComparison,
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
