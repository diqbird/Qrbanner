import type { AnalyticsPayload } from '@/lib/analytics-export';
import { resolveAnalyticsCountryLabel } from './resolve-analytics-country-label';
import { resolveAnalyticsCityLabel } from './resolve-analytics-city-label';
import {
  localizeNamedValues,
  resolveAnalyticsBrowserLabel,
  resolveAnalyticsDeviceLabel,
  resolveAnalyticsOsLabel,
} from './resolve-analytics-scan-copy';
import type { Locale } from './types';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Localize analytics dimension values for CSV/PDF export while keeping stored keys intact server-side. */
export function localizeAnalyticsExportPayload(
  t: TranslateFn,
  locale: Locale,
  data: AnalyticsPayload,
): AnalyticsPayload {
  const recentScans = data.recentScans?.map((scan) => ({
    ...scan,
    country: scan.country
      ? resolveAnalyticsCountryLabel(t, String(scan.country), locale)
      : scan.country,
    city: scan.city ? resolveAnalyticsCityLabel(t, String(scan.city), locale) : scan.city,
    device: scan.device ? resolveAnalyticsDeviceLabel(t, String(scan.device)) : scan.device,
    browser: scan.browser ? resolveAnalyticsBrowserLabel(t, String(scan.browser)) : scan.browser,
    os: scan.os ? resolveAnalyticsOsLabel(t, String(scan.os)) : scan.os,
  }));

  return {
    ...data,
    scansByCountry: localizeNamedValues(data.scansByCountry ?? [], (name) =>
      resolveAnalyticsCountryLabel(t, name, locale),
    ),
    scansByCity: localizeNamedValues(data.scansByCity ?? [], (name) =>
      resolveAnalyticsCityLabel(t, name, locale),
    ),
    scansByDevice: localizeNamedValues(data.scansByDevice ?? [], (name) =>
      resolveAnalyticsDeviceLabel(t, name),
    ),
    scansByBrowser: localizeNamedValues(data.scansByBrowser ?? [], (name) =>
      resolveAnalyticsBrowserLabel(t, name),
    ),
    scansByOS: data.scansByOS
      ? localizeNamedValues(data.scansByOS, (name) => resolveAnalyticsOsLabel(t, name))
      : data.scansByOS,
    recentScans,
  };
}
