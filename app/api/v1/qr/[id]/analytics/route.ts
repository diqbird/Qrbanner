export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { fetchAggregatedAnalytics } from '@/lib/analytics-aggregation';
import { getUserAnalyticsCutoff, parseAnalyticsRange } from '@/lib/analytics-range';
import { assertQrAccess } from '@/lib/workspace';
import { parseAiLocale } from '@/lib/i18n/ai-locale';

/** Slim public API analytics for API-key clients. */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const access = await assertQrAccess(auth.userId, params?.id ?? '', 'viewer');
    if (!access.ok) return apiError('QR code not found', 404, auth.rateLimitHeaders);

    const cutoff = await getUserAnalyticsCutoff(auth.userId);
    const range = parseAnalyticsRange(req.nextUrl.searchParams, cutoff);
    const locale = parseAiLocale(req.nextUrl.searchParams.get('locale'));

    const analytics = await fetchAggregatedAnalytics({
      qrCodeIds: [access.qr.id],
      range,
      locale,
    });

    return apiSuccess(
      {
        data: {
          qr_code_id: access.qr.id,
          name: access.qr.name,
          total_scans: analytics.totalScans,
          unique_scans: analytics.uniqueScans,
          today_scans: analytics.todayScans,
          last_7_days: analytics.last7Days,
          last_30_days: analytics.last30Days,
          scans_by_day: analytics.scansByDay,
          scans_by_device: analytics.scansByDevice,
          scans_by_country: analytics.scansByCountry,
          scans_by_browser: analytics.scansByBrowser,
          scans_by_os: analytics.scansByOS,
          range: {
            from: range.from?.toISOString() ?? null,
            to: range.to?.toISOString() ?? null,
          },
          retention_cutoff: cutoff?.toISOString() ?? null,
        },
      },
      200,
      auth.rateLimitHeaders,
    );
  } catch (error) {
    console.error('API v1 QR analytics error:', error);
    return apiError('Internal server error', 500);
  }
}
