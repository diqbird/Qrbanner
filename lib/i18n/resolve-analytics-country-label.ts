import { GEOIP_COUNTRY_EN_NAMES } from '@/lib/geoip-country-names';
import type { Locale } from './types';
import { intlLocaleTag } from './locale-dictionary';
import { resolveEnumLabel, type TranslateFn } from './resolve-enum-label';

const ENGLISH_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(GEOIP_COUNTRY_EN_NAMES).map(([code, name]) => [name, code]),
);

function regionDisplayName(code: string, locale: Locale): string | undefined {
  try {
    return new Intl.DisplayNames([intlLocaleTag(locale)], { type: 'region' }).of(code);
  } catch {
    return undefined;
  }
}

/** Map stored English country name or ISO code to a locale-aware display label. */
export function resolveAnalyticsCountryLabel(
  t: TranslateFn,
  stored: string | null | undefined,
  locale: Locale = 'en',
): string {
  const value = (stored ?? '').trim();
  if (!value || value === 'Unknown') {
    const unknown = t('analytics.unknown');
    return unknown === 'analytics.unknown' ? 'Unknown' : unknown;
  }

  let code: string | undefined;
  if (/^[A-Za-z]{2}$/.test(value)) {
    code = value.toUpperCase();
  } else {
    code = ENGLISH_NAME_TO_CODE[value];
  }

  if (code) {
    const localized = regionDisplayName(code, locale);
    if (localized) return localized;
  }

  return value;
}

const AB_VARIANT_IDS = new Set(['a', 'b', 'v1', 'v2', 'v3', 'v4', 'v5']);

export function resolveAnalyticsAbVariantLabel(t: TranslateFn, variantId: string): string {
  const id = variantId.trim().toLowerCase();
  if (!id || id === 'unknown' || id === 'null') {
    const unknown = t('analytics.unknown');
    return unknown === 'analytics.unknown' ? 'Unknown' : unknown;
  }
  if (AB_VARIANT_IDS.has(id)) {
    const label = resolveEnumLabel(t, 'analytics.abVariantLabels', id);
    if (label !== id) return label;
  }
  return t('analytics.abVariantFallback', { id: variantId });
}
