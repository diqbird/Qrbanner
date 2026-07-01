'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Smartphone, Globe, Clock, TrendingUp, Download, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadAnalyticsCsv } from '@/lib/analytics-export';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import { buildOptimizationInsights } from '@/lib/optimization-insights';
import { OptimizationInsightsPanel } from './optimization-insights-panel';
import { LeadSubmissionsPanel } from './lead-submissions-panel';
import {
  LandingCtaAnalyticsPanel,
  type LandingCtaAnalytics,
} from './landing-cta-analytics-panel';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import { PeriodChangeBadge } from '@/components/analytics/period-change-badge';
import dynamic from 'next/dynamic';

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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

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
  }, [fetchAnalytics]);

  const handleExport = () => {
    if (!data) return;
    downloadAnalyticsCsv(data, `qr-analytics-${qrId}`);
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
          <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v ?? {})} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> {t('analytics.exportCsv')}
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
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      {landingCta && <LandingCtaAnalyticsPanel data={landingCta} />}

      <LeadSubmissionsPanel qrId={qrId} />

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">{t('analytics.recentScans')}</CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.recentScans?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">{t('analytics.noRecentScans')}</p>
          ) : (
            <div className="space-y-2">
              {(data?.recentScans ?? []).slice(0, 20).map((scan: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{scan?.country ?? 'Unknown'}{scan?.city ? `, ${scan.city}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>{scan?.device ?? 'Unknown'} · {scan?.browser ?? 'Unknown'}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {scan?.scannedAt ? new Date(scan.scannedAt).toLocaleString('en-US', { timeZone: 'UTC' }) : ''}
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
