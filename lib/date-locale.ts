import { format } from 'date-fns';
import { de } from 'date-fns/locale/de';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { tr } from 'date-fns/locale/tr';
import type { Locale } from '@/lib/i18n/types';

export function getDateFnsLocale(locale: Locale) {
  if (locale === 'tr') return tr;
  if (locale === 'de') return de;
  if (locale === 'es') return es;
  return enUS;
}

export function formatLocaleDate(date: Date, locale: Locale, pattern: string) {
  return format(date, pattern, { locale: getDateFnsLocale(locale) });
}
