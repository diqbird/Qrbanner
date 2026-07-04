'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Smartphone, Globe, Clock, TrendingUp, Download, Users, AlertCircle, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadAnalyticsCsv } from '@/lib/analytics-export';
import { buildAnalyticsPdfLabels, downloadAnalyticsPdf } from '@/lib/analytics-pdf-export';
import { toast } from 'sonner';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { buildOptimizationInsights } from '@/lib/optimization-insights';
import { OptimizationInsightsPanel } from './optimization-insights-panel';
import { LeadSubmissionsPanel } from './lead-submissions-panel';
import {
  LandingCtaAnalyticsPanel,
  type LandingCtaAnalytics,
} from './landing-cta-analytics-panel';
import { AnalyticsFunnelPanel } from '@/components/analytics/analytics-funnel-panel';
import { AnalyticsUtmCharts } from '@/components/analytics/analytics-utm-charts';
import { AnalyticsRoiCard } from '@/components/analytics/analytics-roi-card';
import type { FunnelMetrics } from '@/lib/analytics-funnel';
import type { RoiMetrics } from '@/lib/analytics-roi';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import { PeriodChangeBadge } from '@/components/analytics/period-change-badge';
import dynamic from 'next/dynamic';
import {
  ANALYTICS_RANGE_PRESETS,
  ANALYTICS_RANGE_PRESET_LABELS,
  analyticsPresetRange,
  formatScanTimeAgo,
  recentScanRowKey,
} from '@/lib/analytics-view-utils';

const AnalyticsCharts = dynamic(() => import('./analytics-charts'), { ssr: false });

interface AnalyticsData {
  totalScans: number;
  uniqueScans?: number;
  todayScans?: number;
  last7Days: number;
  last30Days: number;
  scansByDay: { date: string; count: number }[];
  scansByDevice: { name: string; value: number }[];
  scansByBrowser: { name: string; value: number }[];
  scansByOS: { name: string; value: number }[];
  scansByHour?: { name: string; hour: number; value: number }[];
  peakInsights?: { peakDay: { name: string; count: number } | null; peakHour: { name: string; count: number } | null };
  scansByCountry: { name: string; value: number }[];
  scansByCity?: { name: string; value: number }[];
  scansByUtmSource?: { name: string; value: number }[];
  scansByUtmMedium?: { name: string; value: number }[];
  scansByUtmCampaign?: { name: string; value: number }[];
  recentScans: any[];
}

export function QRAnalyticsView({ qrId }: { qrId: string }) {
  const { t, locale } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [periodComparison, setPeriodComparison] = useState<PeriodComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [retentionCutoff, setRetentionCutoff] = useState<string | null>(null);
  const [planName, setPlanName] = useState('Free');
  const [qrName, setQrName] = useState('');
  const [landingCta, setLandingCta] = useState<LandingCtaAnalytics | null>(null);
  const [funnel, setFunnel] = useState<FunnelMetrics | null>(null);
  const [roi, setRoi] = useState<RoiMetrics | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => analyticsPresetRange(30));

  const fetchAnalytics = useCallback(async () => {
    try {
      setFetchError(false);
      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString().slice(0, 10));
      if (dateRange.to) params.set('to', dateRange.to.toISOString().slice(0, 10));
      params.set('locale', locale === 'tr' ? 'tr' : 'en');
      const qs = params.toString();
      const res = await fetch(`/api/qr/${qrId}/analytics${qs ? `?${qs}` : ''}`);
      if (!res.ok) {
        setFetchError(true);
        return;
      }
      const result = await res.json();
      setData(result?.analytics ?? null);
      setPeriodComparison(result?.periodComparison ?? null);
      setQrName(result?.qrName ?? '');
      setLandingCta(result?.landingCta ?? null);
      setFunnel(result?.funnel ?? null);
      setRoi(result?.roi ?? null);
      setRetentionCutoff(result?.retentionCutoff ?? null);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [qrId, dateRange, locale]);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan?.name) setPlanName(d.plan.name);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
    const interval = window.setInterval(fetchAnalytics, 30000);
    return () => window.clearInterval(interval);
  }, [fetchAnalytics]);

  const applyPreset = (days: number) => {
    setDateRange(analyticsPresetRange(days));
  };

  const handleExport = () => {
    if (!data) return;
    downloadAnalyticsCsv(data, `qr-analytics-${qrId}`);
  };

  const handleExportPdf = async () => {
    if (!data) return;
    try {
      const periodLabel =
        dateRange.from && dateRange.to
          ? `${format(dateRange.from, 'yyyy-MM-dd')} – ${format(dateRange.to, 'yyyy-MM-dd')}`
          : undefined;
      await downloadAnalyticsPdf(data, {
        filename: `qr-analytics-${qrId}`,
        subtitle: qrName || undefined,
        periodLabel,
        labels: buildAnalyticsPdfLabels(t),
      });
      toast.success(t('analytics.pdfDownloaded'));
    } catch {
      toast.error(t('analytics.loadError'));
    }
  };

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
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchAnalytics(); }}>
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
        <div className="flex items-center gap-3">
          <Link href={`/qr/${qrId}`}>
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{t('analytics.analyticsTitle')}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{qrName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ANALYTICS_RANGE_PRESETS.map((days) => (
            <Button
              key={days}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => applyPreset(days)}
            >
              {t(ANALYTICS_RANGE_PRESET_LABELS[days])}
            </Button>
          ))}
          <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v ?? {})} />
        </div>
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/qr/${qrId}`}>
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">{t('analytics.analyticsTitle')}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{qrName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ANALYTICS_RANGE_PRESETS.map((days) => (
            <Button
              key={days}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => applyPreset(days)}
            >
              {t(ANALYTICS_RANGE_PRESET_LABELS[days])}
            </Button>
          ))}
          <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v ?? {})} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> {t('analytics.exportCsv')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
            <Download className="h-4 w-4" /> {t('analytics.exportPdf')}
          </Button>
        </div>
      </div>

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

      {/* Stats Cards */}
      {periodComparison?.totalScans.changePct !== null && periodComparison?.totalScans.changePct !== undefined ? (
        <p className="text-xs text-muted-foreground">{t('analytics.vsPreviousPeriod')}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: t('analytics.totalScans'),
            value: data?.totalScans ?? 0,
            icon: TrendingUp,
            color: 'text-primary',
            changePct: periodComparison?.totalScans.changePct,
          },
          {
            label: t('analytics.uniqueVisitors'),
            value: data?.uniqueScans ?? 0,
            icon: Users,
            color: 'text-violet-500',
            changePct: periodComparison?.uniqueScans.changePct,
          },
          { label: t('analytics.today'), value: data?.todayScans ?? 0, icon: Clock, color: 'text-orange-500' },
          { label: t('analytics.last7Days'), value: data?.last7Days ?? 0, icon: BarChart3, color: 'text-green-500' },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    {'changePct' in stat ? <PeriodChangeBadge changePct={stat.changePct} /> : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {data && (
        <OptimizationInsightsPanel
          insights={buildOptimizationInsights(
            (data.recentScans ?? []).map((s: { country?: string; device?: string; scannedAt?: string }) => ({
              country: s.country,
              device: s.device,
              scannedAt: s.scannedAt,
            })),
            { totalScans: data.totalScans, uniqueScans: data.uniqueScans }
          )}
        />
      )}

      {/* Charts */}
      {data && <AnalyticsCharts data={data} />}

      {data && (
        <AnalyticsUtmCharts
          scansByUtmSource={data.scansByUtmSource}
          scansByUtmMedium={data.scansByUtmMedium}
          scansByUtmCampaign={data.scansByUtmCampaign}
        />
      )}

      {funnel && <AnalyticsFunnelPanel data={funnel} />}

      {roi && (
        <AnalyticsRoiCard qrId={qrId} data={roi} onSaved={() => { setLoading(true); fetchAnalytics(); }} />
      )}

      {landingCta && <LandingCtaAnalyticsPanel data={landingCta} />}

      <LeadSubmissionsPanel qrId={qrId} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-display text-base">{t('analytics.recentScans')}</CardTitle>
          <span className="text-xs text-muted-foreground">{t('analytics.updatesEvery')}</span>
        </CardHeader>
        <CardContent>
          {(data?.recentScans?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t('analytics.noRecentScans')}</p>
          ) : (
            <div className="space-y-2">
              {(data?.recentScans ?? []).slice(0, 20).map((scan: any, i: number) => (
                <div key={recentScanRowKey(scan, i)} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 text-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span>{scan?.country ?? '—'}{scan?.city ? `, ${scan.city}` : ''}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                      <Smartphone className="h-3.5 w-3.5 shrink-0" />
                      <span>{scan?.device ?? '—'} · {scan?.browser ?? '—'}</span>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {scan?.scannedAt
                      ? formatScanTimeAgo(t, scan.scannedAt)
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
