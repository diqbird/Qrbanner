import { PLANS, type PlanId, ANNUAL_DISCOUNT_PERCENT, annualTotalPrice } from '@/lib/plans';
import { formatLocaleCurrency, formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

/** Canonical EN USD token e.g. `$9.99/mo` — derived from PLANS, never hardcode elsewhere. */
export function planPriceTokenEn(planId: PlanId): string {
  const monthly = PLANS[planId].priceMonthly ?? 0;
  return `$${monthly}/mo`;
}

export function formatPlanPriceLabel(planId: PlanId, locale: Locale): string {
  const monthly = PLANS[planId].priceMonthly ?? 0;
  return formatLocaleCurrency(monthly, locale, { maximumFractionDigits: 2, convertTry: true });
}

export function formatPlanPricePerMonth(planId: PlanId, locale: Locale): string {
  const price = formatPlanPriceLabel(planId, locale);
  return locale === 'tr' ? `${price}/ay` : locale === 'de' ? `${price}/Mo.` : locale === 'es' ? `${price}/mes` : `${price}/mo`;
}

export function pricingMetaVars(locale: Locale): Record<string, string> {
  return {
    proPrice: formatPlanPricePerMonth('pro', locale),
  };
}

export function annualBilledNoteVars(planId: PlanId, locale: Locale): Record<string, string> | null {
  const monthly = PLANS[planId].priceMonthly;
  if (!monthly || monthly <= 0) return null;
  const total = annualTotalPrice(monthly);
  return {
    total: formatLocaleCurrency(total, locale, { maximumFractionDigits: 2, convertTry: true }),
    percent: formatLocaleNumber(ANNUAL_DISCOUNT_PERCENT, locale),
  };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replace SoT price tokens (and legacy hardcoded USD strings) with locale-aware prices. */
export function localizePlanPricingInText(text: string, locale: Locale): string {
  const pro = formatPlanPricePerMonth('pro', locale);
  const business = formatPlanPricePerMonth('business', locale);
  const agency = formatPlanPricePerMonth('agency', locale);
  const proTok = planPriceTokenEn('pro');
  const businessTok = planPriceTokenEn('business');
  const agencyTok = planPriceTokenEn('agency');
  return text
    .replace(new RegExp(escapeRegExp(proTok), 'gi'), pro)
    .replace(new RegExp(escapeRegExp(businessTok), 'gi'), business)
    .replace(new RegExp(escapeRegExp(agencyTok), 'gi'), agency)
    // Legacy literals if PLANS ever diverged from old copy
    .replace(/\$9\.99\/mo/gi, pro)
    .replace(/\$29\.99\/mo/gi, business)
    .replace(/\$79\.99\/mo/gi, agency);
}
