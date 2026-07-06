'use client';

import { useCallback } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { downloadAnalyticsCsv, buildAnalyticsCsvLabels } from '@/lib/analytics-export';
import { buildAnalyticsPdfLabels, downloadAnalyticsPdf } from '@/lib/analytics-pdf-export';
import type { QrAnalyticsData } from '@/lib/qr-analytics-types';

type Translate = (key: string) => string;

export function useQrAnalyticsExport(
  qrId: string,
  data: QrAnalyticsData | null,
  qrName: string,
  dateRange: DateRange,
  t: Translate,
) {
  const handleExport = useCallback(() => {
    if (!data) return;
    downloadAnalyticsCsv(data, `qr-analytics-${qrId}`, buildAnalyticsCsvLabels(t));
  }, [data, qrId, t]);

  const handleExportPdf = useCallback(async () => {
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
  }, [data, qrId, qrName, dateRange, t]);

  return { handleExport, handleExportPdf };
}
