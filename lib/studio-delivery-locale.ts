import { isLocale, type Locale } from '@/lib/i18n/types';

/** Parse delivery email locale from admin notes (e.g. "locale:tr" or "lang=de"). */
export function resolveStudioDeliveryLocale(notes: string | null | undefined): Locale {
  const text = (notes ?? '').toLowerCase();
  const match = text.match(/(?:locale|lang)\s*[:=]\s*(en|tr|de|es)\b/);
  if (match && isLocale(match[1])) return match[1];
  return 'en';
}
