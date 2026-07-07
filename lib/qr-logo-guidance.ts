import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { Locale } from '@/lib/i18n/types';

/** Max logo share recommended in create-wizard tips. */
export const LOGO_SIZE_WIZARD_TIP_MAX = 0.2;
/** Max logo share recommended in scan simulation tips. */
export const LOGO_SIZE_SCAN_TIP_MAX = 0.25;
/** Threshold above which scannability flags a large logo. */
export const LOGO_SIZE_SCANNABILITY_WARN = 0.28;
/** AI design assistant recommended logo range (fraction of QR area). */
export const LOGO_SIZE_AI_HINT_MIN = 0.18;
export const LOGO_SIZE_AI_HINT_MAX = 0.24;

export function formatLogoSizePercent(fraction: number, locale: Locale): string {
  return formatLocaleNumber(Math.round(fraction * 100), locale);
}

export function logoGuidanceVars(locale: Locale): Record<string, string> {
  return {
    wizardMax: formatLogoSizePercent(LOGO_SIZE_WIZARD_TIP_MAX, locale),
    scanTipMax: formatLogoSizePercent(LOGO_SIZE_SCAN_TIP_MAX, locale),
    warnMax: formatLogoSizePercent(LOGO_SIZE_SCANNABILITY_WARN, locale),
    hintMin: formatLogoSizePercent(LOGO_SIZE_AI_HINT_MIN, locale),
    hintMax: formatLogoSizePercent(LOGO_SIZE_AI_HINT_MAX, locale),
  };
}
