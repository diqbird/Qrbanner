import { subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Locale } from '@/lib/i18n/types';
import { formatLocaleNumber, resolveBcp47Locale } from '@/lib/i18n/format-locale';

export const ANALYTICS_RANGE_PRESETS = [7, 30, 90] as const;

export type AnalyticsRangePreset = (typeof ANALYTICS_RANGE_PRESETS)[number];

export const ANALYTICS_RANGE_PRESET_LABEL_KEY = 'analytics.presetDays' as const;

export function analyticsPresetRange(days: number): DateRange {
  return { from: subDays(new Date(), days - 1), to: new Date() };
}

export function formatAnalyticsScanTime(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(resolveBcp47Locale(locale), { timeZone: 'UTC' });
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
  dateStr: string,
  locale: Locale,
): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('analytics.timeJustNow');
  if (mins < 60) return t('analytics.timeMinutesAgo', { n: formatLocaleNumber(mins, locale) });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('analytics.timeHoursAgo', { n: formatLocaleNumber(hrs, locale) });
  return t('analytics.timeDaysAgo', { n: formatLocaleNumber(Math.floor(hrs / 24), locale) });
}
