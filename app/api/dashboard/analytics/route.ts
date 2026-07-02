export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { fetchAggregatedAnalytics } from '@/lib/analytics-aggregation';
import { buildPeriodComparison } from '@/lib/analytics-comparison';
import { getActiveWorkspaceId } from '@/lib/workspace';
import {
  getPreviousPeriodRange,
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

    const prevRange = getPreviousPeriodRange(range);
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
