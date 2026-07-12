import {
  ANALYTICS_CITY_EN_TO_DE,
  ANALYTICS_CITY_EN_TO_ES,
  ANALYTICS_CITY_EN_TO_TR,
} from '@/lib/analytics-city-names';
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
  const key = value.toLowerCase();
  if (locale === 'tr') return ANALYTICS_CITY_EN_TO_TR[key] ?? value;
  if (locale === 'de') return ANALYTICS_CITY_EN_TO_DE[key] ?? value;
  if (locale === 'es') return ANALYTICS_CITY_EN_TO_ES[key] ?? value;
  return value;
}
