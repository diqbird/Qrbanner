'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Radio } from 'lucide-react';
import { buildOptimizationInsights } from '@/lib/optimization-insights';
import { OptimizationInsightsPanel } from './optimization-insights-panel';
import { LeadSubmissionsPanel } from './lead-submissions-panel';
import { LandingCtaAnalyticsPanel } from './landing-cta-analytics-panel';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { AnalyticsRoiCard } from '@/components/analytics/analytics-roi-card';
import { useQrAnalytics } from '@/hooks/use-qr-analytics';
import { AnalyticsViewHeader } from './analytics-view-header';
import { AnalyticsStatsCards } from './analytics-stats-cards';
import { AnalyticsRecentScans } from './analytics-recent-scans';

const AnalyticsCharts = dynamic(() => import('./analytics-charts'), { ssr: false });

export function QRAnalyticsView({ qrId }: { qrId: string }) {
  const analytics = useQrAnalytics(qrId);
  const {
    t,
    data,
    loading,
    fetchError,
    retentionCutoff,
    planName,
    landingCta,
    funnel,
    roi,
    retry,
  } = analytics;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-4">
        <Link href={`/qr/${qrId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {t('bulk.back')}
          </Button>
        </Link>
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <AlertCircle className="h-10 w-10 text-destructive/70" />
            <p className="font-medium">{t('analytics.loadError')}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              {t('analytics.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data && data.totalScans === 0) {
    return (
      <div className="space-y-6">
        <AnalyticsViewHeader analytics={analytics} showExport={false} />
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">{t('analytics.noScans')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('analytics.noScansQrHint')}</p>
            <ul className="mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
              <li>• {t('analytics.emptyTip1')}</li>
              <li>• {t('analytics.emptyTip2')}</li>
              <li>• {t('analytics.emptyTip3')}</li>
            </ul>
            <Link href={`/qr/${qrId}`} className="mt-6">
              <Button size="sm">{t('analytics.emptyEditQr')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            analytics.retry();
          }}
        />
      )}

      {landingCta && <LandingCtaAnalyticsPanel data={landingCta} />}

      <LeadSubmissionsPanel qrId={qrId} />

      <AnalyticsRecentScans analytics={analytics} />
    </div>
  );
}
