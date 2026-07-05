'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { buildOptimizationInsights } from '@/lib/optimization-insights';
import { OptimizationInsightsPanel } from './optimization-insights-panel';
import { LeadSubmissionsPanel } from './lead-submissions-panel';
import { LandingCtaAnalyticsPanel } from './landing-cta-analytics-panel';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { AnalyticsRoiCard } from '@/components/analytics/analytics-roi-card';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';
import { AnalyticsViewHeader } from './analytics-view-header';
import { AnalyticsStatsCards } from './analytics-stats-cards';
import { AnalyticsRecentScans } from './analytics-recent-scans';

const AnalyticsCharts = dynamic(() => import('./analytics-charts'), { ssr: false });

export function AnalyticsViewDashboard({
  qrId,
  analytics,
}: {
  qrId: string;
  analytics: QrAnalyticsState;
}) {
  const { t, data, retentionCutoff, planName, landingCta, funnel, roi, retry } = analytics;

  return (
    <div className="space-y-6">
      <AnalyticsViewHeader analytics={analytics} />

      {retentionCutoff && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm">
          <span>
            {t('analytics.retentionBanner', {
              date: format(new Date(retentionCutoff), 'MMM d, yyyy'),
              plan: planName,
            })}
          </span>
          <Link href="/pricing" className="text-xs font-medium text-primary hover:underline">
            {t('analytics.retentionUpgrade')}
          </Link>
        </div>
      )}

      <AnalyticsStatsCards analytics={analytics} />

      {data && (
        <OptimizationInsightsPanel
          insights={buildOptimizationInsights(
            (data.recentScans ?? []).map((s) => ({
              country: s.country as string | undefined,
              device: s.device as string | undefined,
              scannedAt: s.scannedAt as string | undefined,
            })),
            { totalScans: data.totalScans, uniqueScans: data.uniqueScans },
          )}
        />
      )}

      {data && (
        <AnalyticsCharts
          data={{
            scansByDay: data.scansByDay,
            scansByDevice: data.scansByDevice ?? [],
            scansByBrowser: data.scansByBrowser ?? [],
            scansByOS: data.scansByOS ?? [],
            scansByHour: data.scansByHour,
            peakInsights: data.peakInsights,
            scansByCountry: data.scansByCountry,
            scansByCity: data.scansByCity,
            scansBySource: data.scansBySource,
            scansByAbVariant: data.scansByAbVariant,
            heatmapPoints: data.heatmapPoints,
          }}
        />
      )}

      {data && (
        <AnalyticsUtmCharts
          scansByUtmSource={data.scansByUtmSource}
          scansByUtmMedium={data.scansByUtmMedium}
          scansByUtmCampaign={data.scansByUtmCampaign}
        />
      )}

      {funnel && <AnalyticsFunnelPanel data={funnel} />}

      {roi && (
        <AnalyticsRoiCard
          qrId={qrId}
          data={roi}
          onSaved={() => {
            retry();
          }}
        />
      )}

      {landingCta && <LandingCtaAnalyticsPanel data={landingCta} />}

      <LeadSubmissionsPanel qrId={qrId} />

      <AnalyticsRecentScans analytics={analytics} />
    </div>
  );
}
