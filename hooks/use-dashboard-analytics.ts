'use client';

import { useEffect, useState, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { downloadAnalyticsCsv, type AnalyticsPayload } from '@/lib/analytics-export';
import { buildAnalyticsPdfLabels, downloadAnalyticsPdf } from '@/lib/analytics-pdf-export';
import { analyticsPresetRange } from '@/lib/analytics-view-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import type { HeatmapPoint } from '@/lib/gps-heatmap';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import type { FunnelMetrics } from '@/lib/analytics-funnel';

export interface DashboardAnalyticsData extends AnalyticsPayload {
  uniqueScans: number;
  todayScans: number;
  scansByDevice: { name: string; value: number }[];
  scansByBrowser: { name: string; value: number }[];
  scansByOS: { name: string; value: number }[];
  scansByHour?: { name: string; hour: number; value: number }[];
  peakInsights?: {
    peakDay: { name: string; count: number } | null;
    peakHour: { name: string; count: number } | null;
  };
  scansByCity: { name: string; value: number }[];
  scansBySource?: { name: string; value: number }[];
  scansByAbVariant?: { name: string; value: number }[];
  scansByUtmSource?: { name: string; value: number }[];
  scansByUtmMedium?: { name: string; value: number }[];
  scansByUtmCampaign?: { name: string; value: number }[];
  heatmapPoints?: HeatmapPoint[];
  recentScans: {
    country: string;
    city: string | null;
    device: string;
    browser: string;
    os: string;
    scannedAt: string;
    qrName: string | null;
  }[];
}

export interface TopQR {
  id: string;
  name: string;
  totalScans: number;
  isActive: boolean;
}

export function useDashboardAnalytics() {
  const { t, locale } = useLanguage();
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [periodComparison, setPeriodComparison] = useState<PeriodComparison | null>(null);
  const [topQRCodes, setTopQRCodes] = useState<TopQR[]>([]);
  const [funnel, setFunnel] = useState<FunnelMetrics | null>(null);
  const [retentionCutoff, setRetentionCutoff] = useState<string | null>(null);
  const [planName, setPlanName] = useState('Free');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(() => analyticsPresetRange(30));

  const fetchAnalytics = useCallback(async () => {
    try {
      setFetchError(false);
      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString().slice(0, 10));
      if (dateRange.to) params.set('to', dateRange.to.toISOString().slice(0, 10));
      params.set('locale', locale === 'tr' ? 'tr' : 'en');
      const qs = params.toString();
      const res = await fetch(`/api/dashboard/analytics${qs ? `?${qs}` : ''}`);
      if (!res.ok) {
        setFetchError(true);
        return;
      }
      const result = await res.json();
      setData(result?.analytics ?? null);
      setPeriodComparison(result?.periodComparison ?? null);
      setTopQRCodes(result?.topQRCodes ?? []);
      setFunnel(result?.funnel ?? null);
      setRetentionCutoff(result?.retentionCutoff ?? null);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [dateRange, locale]);

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
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const applyPreset = (days: number) => {
    setDateRange(analyticsPresetRange(days));
  };

  const handleExportCsv = () => {
    if (!data) return;
    downloadAnalyticsCsv(data, 'dashboard-analytics');
  };

  const handleExportPdf = async () => {
    if (!data) return;
    try {
      const periodLabel =
        dateRange.from && dateRange.to
          ? `${format(dateRange.from, 'yyyy-MM-dd')} – ${format(dateRange.to, 'yyyy-MM-dd')}`
          : undefined;
      await downloadAnalyticsPdf(data, {
        filename: 'dashboard-analytics',
        subtitle: t('dashboard.analyticsOverview'),
        periodLabel,
        labels: buildAnalyticsPdfLabels(t),
      });
      toast.success(t('analytics.pdfDownloaded'));
    } catch {
      toast.error(t('analytics.loadError'));
    }
  };

  const retry = () => {
    setLoading(true);
    fetchAnalytics();
  };

  return {
    t,
    data,
    periodComparison,
    topQRCodes,
    funnel,
    retentionCutoff,
    planName,
    loading,
    fetchError,
    dateRange,
    setDateRange,
    applyPreset,
    handleExportCsv,
    handleExportPdf,
    retry,
  };
}

export type DashboardAnalyticsState = ReturnType<typeof useDashboardAnalytics>;
