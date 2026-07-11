import type { Locale } from './types';
import { getNestedValue } from './types';
import { dictionaryFor, intlLocaleTag } from './locale-dictionary';

export function resolveGeofenceCountryName(code: string, locale: Locale = 'en'): string {
  const tree = dictionaryFor(locale);
  if (code === '*') {
    return getNestedValue(tree, 'qrFeatures.geofenceAllCountries') ?? 'All other countries';
  }
  try {
    const name = new Intl.DisplayNames([intlLocaleTag(locale)], { type: 'region' }).of(code);
    if (name) return name;
  } catch {
    // Intl unavailable — fall through
  }
  return code;
}
