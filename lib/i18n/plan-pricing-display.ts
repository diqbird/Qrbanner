import { PLANS, type PlanId } from '@/lib/plans';
import { formatLocaleCurrency } from './format-locale';
import type { Locale } from './types';

export function formatPlanPriceLabel(planId: PlanId, locale: Locale): string {
  const monthly = PLANS[planId].priceMonthly ?? 0;
  return formatLocaleCurrency(monthly, locale, { maximumFractionDigits: 2, convertTry: true });
}

export function formatPlanPricePerMonth(planId: PlanId, locale: Locale): string {
  const price = formatPlanPriceLabel(planId, locale);
  return locale === 'tr' ? `${price}/ay` : `${price}/mo`;
}

export function pricingMetaVars(locale: Locale): Record<string, string> {
  return {
    proPrice: formatPlanPricePerMonth('pro', locale),
  };
}

export function localizePlanPricingInText(text: string, locale: Locale): string {
  const pro = formatPlanPricePerMonth('pro', locale);
  const business = formatPlanPricePerMonth('business', locale);
  const agency = formatPlanPricePerMonth('agency', locale);
  return text
    .replace(/\$9\.99\/mo/gi, pro)
    .replace(/\$29\.99\/mo/gi, business)
    .replace(/\$79\.99\/mo/gi, agency);
}
