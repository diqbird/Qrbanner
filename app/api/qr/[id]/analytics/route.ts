export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { buildAnalytics } from '@/lib/analytics-utils';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import {
  earliestAnalyticsFetchDate,
  filterScansByRange,
  getPreviousPeriodRange,
  getUserAnalyticsCutoff,
  parseAnalyticsRange,
} from '@/lib/analytics-range';
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

    const where: { qrCodeId: string; scannedAt?: { gte?: Date; lte?: Date } } = {
      qrCodeId: qrCode.id,
    };
    if (fetchFrom || range.to) {
      where.scannedAt = {};
      if (fetchFrom) where.scannedAt.gte = fetchFrom;
      if (range.to) where.scannedAt.lte = range.to;
    } else if (cutoff) {
      where.scannedAt = { gte: cutoff };
    }

    const scans = await prisma.qRScan.findMany({
      where,
      orderBy: { scannedAt: 'desc' },
    });

    const filtered = filterScansByRange(scans, range);
    const previousFiltered = prevRange ? filterScansByRange(scans, prevRange) : [];
    const localeParam = req.nextUrl.searchParams.get('locale');
    const locale = localeParam === 'tr' ? 'tr' : 'en';
    const analytics = buildAnalytics(filtered, 30, range, locale);
    const periodComparison = prevRange
      ? buildPeriodComparison(analytics, buildAnalytics(previousFiltered, 30, prevRange, locale))
      : null;

    return NextResponse.json({
      analytics,
      periodComparison,
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
