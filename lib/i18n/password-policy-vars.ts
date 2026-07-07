import { PASSWORD_MIN_LENGTH } from '@/lib/password-policy';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function passwordPolicyVars(locale: Locale): Record<string, string> {
  return { min: formatLocaleNumber(PASSWORD_MIN_LENGTH, locale) };
}
