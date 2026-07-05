'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useDashboardAnalyticsFetch } from '@/hooks/use-dashboard-analytics-fetch';
import { useDashboardAnalyticsExport } from '@/hooks/use-dashboard-analytics-export';

export type {
  DashboardAnalyticsData,
  TopQR,
} from '@/lib/dashboard-analytics-types';

export function useDashboardAnalytics() {
  const { t } = useLanguage();
  const fetchState = useDashboardAnalyticsFetch();
  const { handleExportCsv, handleExportPdf } = useDashboardAnalyticsExport(
    fetchState.data,
    fetchState.dateRange,
    t,
  );

  return {
    t,
    ...fetchState,
    handleExportCsv,
    handleExportPdf,
  };
}

export type DashboardAnalyticsState = ReturnType<typeof useDashboardAnalytics>;
