import { PLANS, type PlanId } from '@/lib/plans';
import { formatLocaleDecimal, formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export const DEVELOPER_RATE_LIMIT_PLAN_IDS: PlanId[] = ['free', 'pro', 'business', 'agency'];

export function formatDeveloperRateLimitLine(planId: PlanId, locale: Locale): string {
  const plan = PLANS[planId];
  const perMin = formatLocaleNumber(plan.apiRateLimitPerMin, locale);
  const monthly = formatLocaleNumber(plan.apiMonthlyQuota, locale);
  if (locale === 'tr') {
    return `${plan.name} — ${perMin}/dk · ${monthly}/ay`;
  }
  return `${plan.name} — ${perMin}/min · ${monthly}/mo`;
}

/** Monthly uptime SLA target cited in enterprise overview copy. */
export const ENTERPRISE_UPTIME_SLA_PERCENT = 99.9;

export function formatEnterpriseUptimeSla(locale: Locale): string {
  return `${formatLocaleDecimal(ENTERPRISE_UPTIME_SLA_PERCENT, locale, 1)}%`;
}

export function localizeEnterpriseOverviewItem(text: string, locale: Locale): string {
  const uptime = formatEnterpriseUptimeSla(locale);
  return text
    .replace(/99\.9%/g, uptime)
    .replace(/%99,9/g, locale === 'tr' ? `%${formatLocaleDecimal(ENTERPRISE_UPTIME_SLA_PERCENT, locale, 1)}` : uptime);
}
