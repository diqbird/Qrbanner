import type { buildAnalytics } from '@/lib/analytics-utils';

export interface MetricComparison {
  current: number;
  previous: number;
  changePct: number | null;
}

export interface PeriodComparison {
  totalScans: MetricComparison;
  uniqueScans: MetricComparison;
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function buildPeriodComparison(
  current: ReturnType<typeof buildAnalytics>,
  previous: ReturnType<typeof buildAnalytics>,
): PeriodComparison {
  return {
    totalScans: {
      current: current.totalScans,
      previous: previous.totalScans,
      changePct: percentChange(current.totalScans, previous.totalScans),
    },
    uniqueScans: {
      current: current.uniqueScans,
      previous: previous.uniqueScans,
      changePct: percentChange(current.uniqueScans, previous.uniqueScans),
    },
  };
}
