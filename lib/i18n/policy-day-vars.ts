import {
  PASSWORD_RESET_CODE_TTL_MINUTES,
  VERIFICATION_CODE_TTL_MINUTES,
} from '@/lib/auth-code-policy';
import { PRO_TRIAL_DAYS } from '@/lib/pro-trial';
import { REFUND_RESPONSE_BUSINESS_DAYS, REFUND_WINDOW_DAYS } from '@/lib/refund-policy';
import { SESSION_REMEMBER_ME_DAYS } from '@/lib/session-policy';
import {
  DNS_PROPAGATION_MAX_HOURS,
  OG_IMAGE_RECOMMENDED_HEIGHT,
  OG_IMAGE_RECOMMENDED_WIDTH,
} from '@/lib/site-media-policy';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function proTrialDayVars(locale: Locale): Record<string, string> {
  return { days: formatLocaleNumber(PRO_TRIAL_DAYS, locale) };
}

export function refundWindowDayVars(locale: Locale): Record<string, string> {
  return { days: formatLocaleNumber(REFUND_WINDOW_DAYS, locale) };
}

export function refundPolicyVars(locale: Locale): Record<string, string> {
  return {
    ...refundWindowDayVars(locale),
    responseDays: formatLocaleNumber(REFUND_RESPONSE_BUSINESS_DAYS, locale),
  };
}

export function sessionPolicyVars(locale: Locale): Record<string, string> {
  return { days: formatLocaleNumber(SESSION_REMEMBER_ME_DAYS, locale) };
}

export function dnsPolicyVars(locale: Locale): Record<string, string> {
  return { hours: formatLocaleNumber(DNS_PROPAGATION_MAX_HOURS, locale) };
}

export function ogImageDimensionVars(locale: Locale): Record<string, string> {
  return {
    width: formatLocaleNumber(OG_IMAGE_RECOMMENDED_WIDTH, locale),
    height: formatLocaleNumber(OG_IMAGE_RECOMMENDED_HEIGHT, locale),
  };
}

export function authEmailDurationVars(locale: Locale): Record<string, string> {
  return {
    verifyMinutes: formatLocaleNumber(VERIFICATION_CODE_TTL_MINUTES, locale),
    resetMinutes: formatLocaleNumber(PASSWORD_RESET_CODE_TTL_MINUTES, locale),
  };
}

export function policyDayVars(locale: Locale): Record<string, string> {
  return { ...proTrialDayVars(locale), ...refundWindowDayVars(locale) };
}
