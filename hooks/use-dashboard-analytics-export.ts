'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { downloadAnalyticsCsv, buildAnalyticsCsvLabels } from '@/lib/analytics-export';
import {
  buildAnalyticsPdfLabels,
  downloadAnalyticsPdf,
  loadAnalyticsPdfBranding,
} from '@/lib/analytics-pdf-export';
import { localizeAnalyticsExportPayload } from '@/lib/i18n/localize-analytics-export-payload';
import type { Locale } from '@/lib/i18n/types';
import type { DashboardAnalyticsData } from '@/lib/dashboard-analytics-types';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useDashboardAnalyticsExport(
  data: DashboardAnalyticsData | null,
  dateRange: DateRange,
  t: Translate,
  locale: Locale,
) {
  const handleExportCsv = useCallback(() => {
    if (!data) return;
    const localized = localizeAnalyticsExportPayload(t, locale, data);
    downloadAnalyticsCsv(localized, 'dashboard-analytics', buildAnalyticsCsvLabels(t, locale));
  }, [data, t, locale]);

  const handleExportPdf = useCallback(async () => {
    if (!data) return;
    try {
      const periodLabel =
        dateRange.from && dateRange.to
          ? `${format(dateRange.from, 'yyyy-MM-dd')} – ${format(dateRange.to, 'yyyy-MM-dd')}`
          : undefined;
      const localized = localizeAnalyticsExportPayload(t, locale, data);
      const branding = await loadAnalyticsPdfBranding();
      await downloadAnalyticsPdf(localized, {
        filename: 'dashboard-analytics',
        subtitle: t('dashboard.analyticsOverview'),
        periodLabel,
        labels: buildAnalyticsPdfLabels(t, locale),
        locale,
        branding,
      });
      toast.success(t('analytics.pdfDownloaded'));
    } catch {
      toast.error(t('analytics.loadError'));
    }
  }, [data, dateRange, t, locale]);

  return { handleExportCsv, handleExportPdf };
}
