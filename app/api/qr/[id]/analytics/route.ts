export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchAggregatedAnalytics } from '@/lib/analytics-aggregation';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  earliestAnalyticsFetchDate,
  getPreviousPeriodRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
} from '@/lib/analytics-range';
import { buildLandingCtaAnalytics, filterCtaClicksByRange } from '@/lib/landing-cta-analytics';
import { buildFunnelMetrics, buildFunnelComparison } from '@/lib/analytics-funnel';
import { fetchFunnelEventCounts } from '@/lib/analytics-funnel-inputs';
import { buildRoiMetrics } from '@/lib/analytics-roi';
import { assertQrAccess } from '@/lib/workspace';
import { parseAiLocale } from '@/lib/i18n/ai-locale';

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const access = await assertQrAccess(userId, params?.id ?? '', 'viewer');
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: 404 });
    }
    const qrCode = access.qr;

    const cutoff = await getUserAnalyticsCutoff(userId);
    const range = parseAnalyticsRange(req.nextUrl.searchParams, cutoff);

    const prevRange = getPreviousPeriodRange(range);
    const fetchFrom = earliestAnalyticsFetchDate(range, cutoff);
    const locale = parseAiLocale(req.nextUrl.searchParams.get('locale'));

    const analytics = await fetchAggregatedAnalytics({
      qrCodeIds: [qrCode.id],
      range,
      locale,
    });

    const previousAnalytics = prevRange
      ? await fetchAggregatedAnalytics({
          qrCodeIds: [qrCode.id],
          range: prevRange,
          locale,
        })
      : null;

    const periodComparison = previousAnalytics
      ? buildPeriodComparison(analytics, previousAnalytics)
      : null;

    let landingCta = null;
    if (qrCode.landingPageEnabled) {
      const ctaClicks = await prisma.landingCtaClick.findMany({
        where: {
          qrCodeId: qrCode.id,
          ...(fetchFrom || range.to
            ? {
                clickedAt: {
                  ...(fetchFrom ? { gte: fetchFrom } : {}),
                  ...(range.to ? { lte: range.to } : {}),
                },
              }
            : cutoff
              ? { clickedAt: { gte: cutoff } }
              : {}),
        },
        orderBy: { clickedAt: 'desc' },
        take: 500,
        select: {
          ctaType: true,
          ctaLabel: true,
          clickedAt: true,
          device: true,
          country: true,
        },
      });
      const filteredClicks = filterCtaClicksByRange(ctaClicks, range);
      landingCta = buildLandingCtaAnalytics(filteredClicks, analytics.totalScans, range, locale);
    }

    const dateFilter = buildDateFilter(fetchFrom, range, cutoff);
    const prevFetchFrom = prevRange ? earliestAnalyticsFetchDate(prevRange, cutoff) : null;
    const prevDateFilter = prevRange
      ? buildDateFilter(prevFetchFrom, prevRange, cutoff)
      : undefined;

    const [{ ctaClicks, leads: leadsCount }, prevFunnelEvents] = await Promise.all([
      fetchFunnelEventCounts([qrCode.id], dateFilter),
      prevRange
        ? fetchFunnelEventCounts([qrCode.id], prevDateFilter)
        : Promise.resolve({ ctaClicks: 0, leads: 0 }),
    ]);

    const funnel = buildFunnelMetrics({
      scans: analytics.totalScans,
      ctaClicks: landingCta?.totalClicks ?? ctaClicks,
      leads: leadsCount,
      landingEnabled: Boolean(qrCode.landingPageEnabled),
    });

    const funnelComparison =
      previousAnalytics && prevRange
        ? buildFunnelComparison(
            funnel,
            buildFunnelMetrics({
              scans: previousAnalytics.totalScans,
              ctaClicks: prevFunnelEvents.ctaClicks,
              leads: prevFunnelEvents.leads,
              landingEnabled: Boolean(qrCode.landingPageEnabled),
            }),
          )
        : null;

    const roi = buildRoiMetrics({
      leadsCount,
      campaignCost: qrCode.analyticsCampaignCost ?? null,
      valuePerLead: qrCode.analyticsValuePerLead ?? null,
    });

    return NextResponse.json({
      analytics,
      scansByDayPrevious: previousAnalytics?.scansByDay ?? null,
      periodComparison,
      landingCta,
      funnel,
      funnelComparison,
      roi,
      qrName: qrCode.name,
      range: {
        from: range.from?.toISOString() ?? null,
        to: range.to?.toISOString() ?? null,
      },
      retentionCutoff: cutoff?.toISOString() ?? null,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
