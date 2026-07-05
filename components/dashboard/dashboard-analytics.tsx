'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Radio } from 'lucide-react';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { DashboardAnalyticsToolbar } from './dashboard-analytics-toolbar';
import { DashboardAnalyticsStats } from './dashboard-analytics-stats';
import { DashboardAnalyticsTopQr } from './dashboard-analytics-top-qr';
import { DashboardAnalyticsLiveScans } from './dashboard-analytics-live-scans';

const AnalyticsCharts = dynamic(() => import('@/components/qr/analytics-charts'), { ssr: false });

export function DashboardAnalyticsPanel() {
  const analytics = useDashboardAnalytics();
  const { t, data, loading, fetchError, retentionCutoff, planName, funnel, retry } = analytics;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive/70" />
          <p className="font-medium">{t('analytics.loadError')}</p>
          <Button variant="outline" size="sm" onClick={retry}>
            {t('analytics.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalScans === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">{t('analytics.noScans')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('analytics.noScansHint')}</p>
          <ul className="mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>• {t('analytics.emptyTip1')}</li>
            <li>• {t('analytics.emptyTip2')}</li>
            <li>• {t('analytics.emptyTip3')}</li>
          </ul>
          <Link href="/qr/create?quick=1" className="mt-6">
            <Button size="sm">{t('analytics.emptyCta')}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

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
