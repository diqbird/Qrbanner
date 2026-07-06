'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { downloadAnalyticsCsv, buildAnalyticsCsvLabels } from '@/lib/analytics-export';
import { buildAnalyticsPdfLabels, downloadAnalyticsPdf } from '@/lib/analytics-pdf-export';
import type { DashboardAnalyticsData } from '@/lib/dashboard-analytics-types';

type Translate = (key: string) => string;

export function useDashboardAnalyticsExport(
  data: DashboardAnalyticsData | null,
  dateRange: DateRange,
  t: Translate,
) {
  const handleExportCsv = useCallback(() => {
    if (!data) return;
    downloadAnalyticsCsv(data, 'dashboard-analytics', buildAnalyticsCsvLabels(t));
  }, [data, t]);

  const handleExportPdf = useCallback(async () => {
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
  }, [data, dateRange, t]);

  return { handleExportCsv, handleExportPdf };
}
