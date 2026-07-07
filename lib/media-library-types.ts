import type { Locale } from '@/lib/i18n/types';
import { formatLocaleDecimal, formatLocaleNumber } from '@/lib/i18n/format-locale';

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export function formatMediaBytes(n: number, locale: Locale) {
  if (n < 1024) return `${formatLocaleNumber(n, locale)} B`;
  if (n < 1024 * 1024) return `${formatLocaleDecimal(n / 1024, locale, 1)} KB`;
  return `${formatLocaleDecimal(n / (1024 * 1024), locale, 1)} MB`;
}
