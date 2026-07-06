import type { Locale } from './types';
import { getNestedValue } from './types';
import { en } from './en';
import { tr } from './tr';

export function resolveGeofenceCountryName(code: string, locale: Locale = 'en'): string {
  const tree = locale === 'tr' ? tr : en;
  if (code === '*') {
    return getNestedValue(tree, 'qrFeatures.geofenceAllCountries') ?? 'All other countries';
  }
  try {
    const displayNames = new Intl.DisplayNames([locale === 'tr' ? 'tr' : 'en'], { type: 'region' });
    const name = displayNames.of(code);
    if (name) return name;
  } catch {
    // Intl unavailable — fall through
  }
  return code;
}
