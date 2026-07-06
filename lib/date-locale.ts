import { format } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { tr } from 'date-fns/locale/tr';
import type { Locale } from '@/lib/i18n/types';

export function getDateFnsLocale(locale: Locale) {
  return locale === 'tr' ? tr : enUS;
}

export function formatLocaleDate(date: Date, locale: Locale, pattern: string) {
  return format(date, pattern, { locale: getDateFnsLocale(locale) });
}
