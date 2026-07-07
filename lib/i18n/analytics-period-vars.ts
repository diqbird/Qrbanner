import {
  ANALYTICS_ROLLING_7_DAYS,
  ANALYTICS_ROLLING_30_DAYS,
  LIVE_SCAN_REFRESH_SECONDS,
} from '@/lib/analytics-period-policy';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function analyticsPeriodVars(locale: Locale): Record<string, string> {
  return {
    days7: formatLocaleNumber(ANALYTICS_ROLLING_7_DAYS, locale),
    days30: formatLocaleNumber(ANALYTICS_ROLLING_30_DAYS, locale),
    refreshSeconds: formatLocaleNumber(LIVE_SCAN_REFRESH_SECONDS, locale),
  };
}
