'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { DashboardAnalyticsToolbar } from './dashboard-analytics-toolbar';
import { DashboardAnalyticsStats } from './dashboard-analytics-stats';
import { DashboardAnalyticsTopQr } from './dashboard-analytics-top-qr';
import { DashboardAnalyticsLiveScans } from './dashboard-analytics-live-scans';
import {
  DashboardAnalyticsLoading,
  DashboardAnalyticsError,
  DashboardAnalyticsEmpty,
} from './dashboard-analytics-states';

const AnalyticsCharts = dynamic(() => import('@/components/qr/analytics-charts'), { ssr: false });

export function DashboardAnalyticsPanel() {
  const analytics = useDashboardAnalytics();
  const { t, data, loading, fetchError, retentionCutoff, planName, funnel, retry } = analytics;

  if (loading) return <DashboardAnalyticsLoading />;
  if (fetchError) return <DashboardAnalyticsError onRetry={retry} />;
  if (!data || data.totalScans === 0) return <DashboardAnalyticsEmpty />;

  return (
    <div className="space-y-6">
      {retentionCutoff && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm">
          <span>
            {t('analytics.retentionBanner', {
              date: format(new Date(retentionCutoff), 'MMM d, yyyy'),
              plan: planName,
            })}
          </span>
          <Link href="/pricing" className="text-primary hover:underline text-xs font-medium">
            {t('analytics.retentionUpgrade')}
          </Link>
        </div>
      )}

      <DashboardAnalyticsToolbar analytics={analytics} />
      <DashboardAnalyticsStats analytics={analytics} />

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

      <AnalyticsUtmCharts
        scansByUtmSource={data.scansByUtmSource}
        scansByUtmMedium={data.scansByUtmMedium}
        scansByUtmCampaign={data.scansByUtmCampaign}
      />

      {funnel && <AnalyticsFunnelPanel data={funnel} />}
      <DashboardAnalyticsTopQr analytics={analytics} />
      <DashboardAnalyticsLiveScans analytics={analytics} />
    </div>
  );
}
