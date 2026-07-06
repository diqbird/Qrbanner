'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useQrAnalyticsFetch } from '@/hooks/use-qr-analytics-fetch';
import { useQrAnalyticsExport } from '@/hooks/use-qr-analytics-export';

export type { QrAnalyticsData } from '@/lib/qr-analytics-types';

export function useQrAnalytics(qrId: string) {
  const { t, locale } = useLanguage();
  const fetchState = useQrAnalyticsFetch(qrId);
  const { handleExport, handleExportPdf } = useQrAnalyticsExport(
    qrId,
    fetchState.data,
    fetchState.qrName,
    fetchState.dateRange,
    t,
    locale,
  );

  return {
    t,
    qrId,
    ...fetchState,
    handleExport,
    handleExportPdf,
  };
}

export type QrAnalyticsState = ReturnType<typeof useQrAnalytics>;
