import { QR_CATEGORIES } from '@/lib/qr-utils';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function formatQrTypeCount(locale: Locale): string {
  return `${formatLocaleNumber(QR_CATEGORIES.length, locale)}+`;
}
