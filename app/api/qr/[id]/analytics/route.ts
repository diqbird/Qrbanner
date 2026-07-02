export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { fetchAggregatedAnalytics } from '@/lib/analytics-aggregation';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import {
  earliestAnalyticsFetchDate,
  getPreviousPeriodRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
} from '@/lib/analytics-range';
import { buildLandingCtaAnalytics, filterCtaClicksByRange } from '@/lib/landing-cta-analytics';
import { assertQrAccess } from '@/lib/workspace';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const access = await assertQrAccess(userId, params?.id ?? '', 'viewer');
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: 404 });
    }
    const qrCode = access.qr;

    const cutoff = await getUserAnalyticsCutoff(userId);
    const range = parseAnalyticsRange(req.nextUrl.searchParams, cutoff);

    const prevRange = getPreviousPeriodRange(range);
    const fetchFrom = earliestAnalyticsFetchDate(range, cutoff);
    const localeParam = req.nextUrl.searchParams.get('locale');
    const locale = localeParam === 'tr' ? 'tr' : 'en';

    const analytics = await fetchAggregatedAnalytics({
      qrCodeIds: [qrCode.id],
      range,
      locale,
    });

    const periodComparison = prevRange
      ? buildPeriodComparison(
          analytics,
          await fetchAggregatedAnalytics({
            qrCodeIds: [qrCode.id],
            range: prevRange,
            locale,
          }),
        )
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

    return NextResponse.json({
      analytics,
      periodComparison,
      landingCta,
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
