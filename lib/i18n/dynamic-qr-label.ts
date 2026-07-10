import { freePlanQrLimit } from '@/lib/plans';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

/** "1 dynamic QR code" vs "200 dynamic QR codes" (EN); TR uses "dinamik QR kodu" for all counts. */
export function formatDynamicQrLabel(count: number, locale: Locale): string {
  const n = formatLocaleNumber(count, locale);
  if (locale === 'tr') return `${n} dinamik QR kodu`;
  if (locale === 'de') return count === 1 ? `${n} dynamischer QR-Code` : `${n} dynamische QR-Codes`;
  if (locale === 'es') return count === 1 ? `${n} código QR dinámico` : `${n} códigos QR dinámicos`;
  return count === 1 ? `${n} dynamic QR code` : `${n} dynamic QR codes`;
}

export function formatFreePlanDynamicQrLabel(locale: Locale): string {
  return formatDynamicQrLabel(freePlanQrLimit(), locale);
}

/** Hero / trust strip — "1 free dynamic code" vs "N free dynamic codes". */
export function formatFreePlanDynamicQrShortLabel(locale: Locale): string {
  const count = freePlanQrLimit();
  const n = formatLocaleNumber(count, locale);
  if (locale === 'tr') return `${n} ücretsiz dinamik kod`;
  if (locale === 'de') return count === 1 ? `${n} kostenloser dynamischer Code` : `${n} kostenlose dynamische Codes`;
  if (locale === 'es') return count === 1 ? `${n} código dinámico gratis` : `${n} códigos dinámicos gratis`;
  return count === 1 ? `${n} free dynamic code` : `${n} free dynamic codes`;
}

/** "1 editable QR code" vs "N editable QR codes" (EN). */
export function formatEditableQrLabel(count: number, locale: Locale): string {
  const n = formatLocaleNumber(count, locale);
  if (locale === 'tr') return `${n} düzenlenebilir QR kodu`;
  if (locale === 'de') return count === 1 ? `${n} bearbeitbarer QR-Code` : `${n} bearbeitbare QR-Codes`;
  if (locale === 'es') return count === 1 ? `${n} código QR editable` : `${n} códigos QR editables`;
  return count === 1 ? `${n} editable QR code` : `${n} editable QR codes`;
}

export function formatFreePlanEditableQrLabel(locale: Locale): string {
  return formatEditableQrLabel(freePlanQrLimit(), locale);
}

/** Referral / signup — includes "free" in EN; TR uses "ücretsiz dinamik QR kodu". */
export function formatFreePlanReferralQrLabel(locale: Locale): string {
  const count = freePlanQrLimit();
  const n = formatLocaleNumber(count, locale);
  if (locale === 'tr') return `${n} ücretsiz dinamik QR kodu`;
  if (locale === 'de') return count === 1 ? `${n} kostenloser dynamischer QR-Code` : `${n} kostenlose dynamische QR-Codes`;
  if (locale === 'es') return count === 1 ? `${n} código QR dinámico gratis` : `${n} códigos QR dinámicos gratis`;
  return count === 1 ? `${n} free dynamic QR code` : `${n} free dynamic QR codes`;
}
