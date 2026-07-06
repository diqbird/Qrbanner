import { translate, type Locale } from '@/lib/i18n';
import type { AutomationContext } from '@/lib/automation-types';
import { resolveAnalyticsCityLabel } from './resolve-analytics-city-label';
import { resolveAnalyticsCountryLabel } from './resolve-analytics-country-label';
import {
  resolveAnalyticsBrowserLabel,
  resolveAnalyticsDeviceLabel,
  resolveAnalyticsOsLabel,
} from './resolve-analytics-scan-copy';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Localize geo/device fields before template interpolation in outbound automations. */
export function localizeAutomationContext(ctx: AutomationContext, locale: Locale): AutomationContext {
  const t: TranslateFn = (key, vars) => translate(locale, key, vars);
  return {
    ...ctx,
    country: ctx.country ? resolveAnalyticsCountryLabel(t, ctx.country, locale) : ctx.country,
    city: ctx.city ? resolveAnalyticsCityLabel(t, ctx.city, locale) : ctx.city,
    device: ctx.device ? resolveAnalyticsDeviceLabel(t, ctx.device) : ctx.device,
    browser: ctx.browser ? resolveAnalyticsBrowserLabel(t, ctx.browser) : ctx.browser,
    os: ctx.os ? resolveAnalyticsOsLabel(t, ctx.os) : ctx.os,
  };
}
