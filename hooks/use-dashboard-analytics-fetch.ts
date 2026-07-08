'use client';

import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { analyticsPresetRange } from '@/lib/analytics-view-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import type {
  DashboardAnalyticsData,
  DashboardAnalyticsApiResult,
  TopQR,
} from '@/lib/dashboard-analytics-types';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import type { FunnelMetrics, FunnelComparison } from '@/lib/analytics-funnel';
import { useDashboardAnalyticsPlan } from '@/hooks/use-dashboard-analytics-plan';

export function useDashboardAnalyticsFetch() {
  const { locale } = useLanguage();
  const planName = useDashboardAnalyticsPlan();
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [periodComparison, setPeriodComparison] = useState<PeriodComparison | null>(null);
  const [topQRCodes, setTopQRCodes] = useState<TopQR[]>([]);
  const [funnel, setFunnel] = useState<FunnelMetrics | null>(null);
  const [funnelComparison, setFunnelComparison] = useState<FunnelComparison | null>(null);
  const [scansByDayPrevious, setScansByDayPrevious] = useState<{ date: string; count: number }[] | null>(null);
  const [retentionCutoff, setRetentionCutoff] = useState<string | null>(null);
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
      const result = (await res.json()) as DashboardAnalyticsApiResult & {
        analytics?: DashboardAnalyticsData;
        scansByDayPrevious?: { date: string; count: number }[] | null;
        periodComparison?: PeriodComparison;
        topQRCodes?: TopQR[];
        funnel?: FunnelMetrics;
        funnelComparison?: FunnelComparison;
        retentionCutoff?: string;
      };
      setData(result?.analytics ?? null);
      setPeriodComparison(result?.periodComparison ?? null);
      setTopQRCodes(result?.topQRCodes ?? []);
      setFunnel(result?.funnel ?? null);
      setFunnelComparison(result?.funnelComparison ?? null);
      setScansByDayPrevious(result?.scansByDayPrevious ?? null);
      setRetentionCutoff(result?.retentionCutoff ?? null);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [dateRange, locale]);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const applyPreset = (days: number) => {
    setDateRange(analyticsPresetRange(days));
  };

  const retry = () => {
    setLoading(true);
    fetchAnalytics();
  };

  return {
    data,
    periodComparison,
    topQRCodes,
    funnel,
    funnelComparison,
    scansByDayPrevious,
    retentionCutoff,
    planName,
    loading,
    fetchError,
    dateRange,
    setDateRange,
    applyPreset,
    retry,
    fetchAnalytics,
  };
}
