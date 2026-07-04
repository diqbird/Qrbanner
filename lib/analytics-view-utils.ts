import { subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export const ANALYTICS_RANGE_PRESETS = [7, 30, 90] as const;

export type AnalyticsRangePreset = (typeof ANALYTICS_RANGE_PRESETS)[number];

export const ANALYTICS_RANGE_PRESET_LABELS: Record<AnalyticsRangePreset, string> = {
  7: 'analytics.preset7d',
  30: 'analytics.preset30d',
  90: 'analytics.preset90d',
};

export function analyticsPresetRange(days: number): DateRange {
  return { from: subDays(new Date(), days - 1), to: new Date() };
}

export function formatAnalyticsScanTime(iso: string, locale: string): string {
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Date(iso).toLocaleString(tag, { timeZone: 'UTC' });
}

export function recentScanRowKey(
  scan: { scannedAt?: string; country?: string; device?: string; browser?: string },
  index: number
): string {
  if (scan.scannedAt) {
    return `${scan.scannedAt}-${scan.country ?? ''}-${scan.device ?? ''}-${scan.browser ?? ''}`;
  }
  return `scan-row-${index}`;
}

export function formatScanTimeAgo(
  t: (key: string, vars?: Record<string, string | number>) => string,
  dateStr: string
): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('analytics.timeJustNow');
  if (mins < 60) return t('analytics.timeMinutesAgo', { n: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('analytics.timeHoursAgo', { n: hrs });
  return t('analytics.timeDaysAgo', { n: Math.floor(hrs / 24) });
}
