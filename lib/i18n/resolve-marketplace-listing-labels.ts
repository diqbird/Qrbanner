import type { Locale } from './types';
import { resolveBcp47Locale } from './format-locale';
import { resolveEnumLabel, type TranslateFn } from './resolve-enum-label';

export function resolveMarketplaceListingStatusLabel(t: TranslateFn, status: string): string {
  return resolveEnumLabel(t, 'marketplaceSeller.listingStatuses', status);
}

export function formatLocalizedListingPrice(
  priceCents: number,
  locale: Locale,
  t: TranslateFn,
  currency = 'usd'
): string {
  if (priceCents <= 0) return t('marketplaceSeller.priceFree');
  return new Intl.NumberFormat(resolveBcp47Locale(locale), {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}
