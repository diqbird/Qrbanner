'use client';

import { useQrAnalytics } from '@/hooks/use-qr-analytics';
import {
  AnalyticsViewLoading,
  AnalyticsViewError,
  AnalyticsViewEmpty,
} from './analytics-view-states';
import { AnalyticsViewDashboard } from './analytics-view-dashboard';

export function QRAnalyticsView({ qrId }: { qrId: string }) {
  const analytics = useQrAnalytics(qrId);
  const { loading, fetchError, data, retry } = analytics;

  if (loading) return <AnalyticsViewLoading />;
  if (fetchError) return <AnalyticsViewError qrId={qrId} t={analytics.t} retry={retry} />;
  if (data && data.totalScans === 0) {
    return <AnalyticsViewEmpty qrId={qrId} analytics={analytics} />;
  }

  return <AnalyticsViewDashboard qrId={qrId} analytics={analytics} />;
}
