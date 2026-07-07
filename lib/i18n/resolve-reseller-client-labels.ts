import type { Locale } from './types';
import { resolveBcp47Locale } from './format-locale';
import { resolveEnumLabel, type TranslateFn } from './resolve-enum-label';

const RESELLER_PLAN_KEYS: Record<string, string> = {
  free: 'enterpriseWorkspace.planFree',
  pro: 'enterpriseWorkspace.planPro',
  business: 'enterpriseWorkspace.planBusiness',
  agency: 'billing.planAgency',
};

export function resolveResellerClientPlanLabel(t: TranslateFn, plan: string): string {
  const key = RESELLER_PLAN_KEYS[plan];
  if (!key) return plan;
  const label = t(key);
  return label === key ? plan : label;
}

export function resolveResellerClientStatusLabel(t: TranslateFn, status: string): string {
  return resolveEnumLabel(t, 'enterpriseWorkspace.clientStatuses', status);
}

export function formatResellerClientMonthlyFee(
  monthlyFeeCents: number,
  locale: Locale,
  t: TranslateFn
): string {
  const amount = new Intl.NumberFormat(resolveBcp47Locale(locale), {
    style: 'currency',
    currency: 'USD',
  }).format(monthlyFeeCents / 100);
  return t('enterpriseWorkspace.clientMonthlyFee', { amount });
}
