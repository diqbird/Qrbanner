import { PRO_TRIAL_DAYS } from '@/lib/pro-trial';
import { REFUND_WINDOW_DAYS } from '@/lib/refund-policy';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function proTrialDayVars(locale: Locale): Record<string, string> {
  return { days: formatLocaleNumber(PRO_TRIAL_DAYS, locale) };
}

export function refundWindowDayVars(locale: Locale): Record<string, string> {
  return { days: formatLocaleNumber(REFUND_WINDOW_DAYS, locale) };
}

export function policyDayVars(locale: Locale): Record<string, string> {
  return { ...proTrialDayVars(locale), ...refundWindowDayVars(locale) };
}
