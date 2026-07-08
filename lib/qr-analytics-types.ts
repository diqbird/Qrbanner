import type { AnalyticsPayload } from '@/lib/analytics-export';
import type { PeriodComparison } from '@/lib/analytics-comparison';
import type { FunnelMetrics, FunnelComparison } from '@/lib/analytics-funnel';
import type { RoiMetrics } from '@/lib/analytics-roi';
import type { LandingCtaAnalytics } from '@/components/qr/landing-cta-analytics-panel';

export type QrAnalyticsData = AnalyticsPayload & {
  scansByUtmSource?: { name: string; value: number }[];
  scansByUtmMedium?: { name: string; value: number }[];
  scansByUtmCampaign?: { name: string; value: number }[];
};

export type QrAnalyticsApiResult = {
  analytics: QrAnalyticsData | null;
  scansByDayPrevious?: { date: string; count: number }[] | null;
  periodComparison: PeriodComparison | null;
  qrName: string;
  landingCta: LandingCtaAnalytics | null;
  funnel: FunnelMetrics | null;
  funnelComparison: FunnelComparison | null;
  roi: RoiMetrics | null;
  retentionCutoff: string | null;
};
