'use client';

import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { analyticsPresetRange } from '@/lib/analytics-view-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import type { FunnelMetrics } from '@/lib/analytics-funnel';
import type { RoiMetrics } from '@/lib/analytics-roi';
import type { LandingCtaAnalytics } from '@/components/qr/landing-cta-analytics-panel';
import type { QrAnalyticsData, QrAnalyticsApiResult } from '@/lib/qr-analytics-types';

export function useQrAnalyticsFetch(qrId: string) {
  const { locale } = useLanguage();
  const [data, setData] = useState<QrAnalyticsData | null>(null);
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
      const result = (await res.json()) as QrAnalyticsApiResult;
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

  const retry = () => {
    setLoading(true);
    fetchAnalytics();
  };

  return {
    data,
    periodComparison,
    loading,
    fetchError,
    retentionCutoff,
    planName,
    qrName,
    landingCta,
    funnel,
    roi,
    dateRange,
    setDateRange,
    applyPreset,
    retry,
    fetchAnalytics,
  };
}
