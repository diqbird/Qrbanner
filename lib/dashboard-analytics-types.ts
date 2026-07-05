import type { AnalyticsPayload } from '@/lib/analytics-export';
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

export type DashboardAnalyticsApiResult = {
  analytics: DashboardAnalyticsData | null;
  periodComparison: PeriodComparison | null;
  topQRCodes: TopQR[];
  funnel: FunnelMetrics | null;
  retentionCutoff: string | null;
};
