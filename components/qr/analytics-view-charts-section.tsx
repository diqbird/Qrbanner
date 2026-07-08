'use client';

import dynamic from 'next/dynamic';
import { buildOptimizationInsights } from '@/lib/optimization-insights';
import { OptimizationInsightsPanel } from './optimization-insights-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';

const AnalyticsCharts = dynamic(() => import('./analytics-charts'), { ssr: false });

export function AnalyticsViewChartsSection({ analytics }: { analytics: QrAnalyticsState }) {
  const { data, funnel, funnelComparison, scansByDayPrevious } = analytics;

  if (!data) return null;

  return (
    <>
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

      <AnalyticsCharts
        data={{
          scansByDay: data.scansByDay,
          scansByDayPrevious,
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

      <AnalyticsUtmCharts
        scansByUtmSource={data.scansByUtmSource}
        scansByUtmMedium={data.scansByUtmMedium}
        scansByUtmCampaign={data.scansByUtmCampaign}
      />

      {funnel && <AnalyticsFunnelPanel data={funnel} comparison={funnelComparison} />}
    </>
  );
}
