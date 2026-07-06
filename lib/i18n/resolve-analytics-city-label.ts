import { ANALYTICS_CITY_EN_TO_TR } from '@/lib/analytics-city-names';
import type { Locale } from './types';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Map stored English geoip city name to a locale-aware display label. */
export function resolveAnalyticsCityLabel(
  t: TranslateFn,
  stored: string | null | undefined,
  locale: Locale = 'en',
): string {
  const value = (stored ?? '').trim();
  if (!value || value === 'Unknown') {
    const unknown = t('analytics.unknown');
    return unknown === 'analytics.unknown' ? 'Unknown' : unknown;
  }
  if (locale === 'tr') {
    return ANALYTICS_CITY_EN_TO_TR[value.toLowerCase()] ?? value;
  }
  return value;
}
