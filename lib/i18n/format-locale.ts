import type { Locale } from './types';

export function resolveBcp47Locale(locale: Locale): string {
  return locale === 'tr' ? 'tr-TR' : 'en-US';
}

export function formatLocaleDateTime(value: string | number | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString(resolveBcp47Locale(locale));
}

export function formatLocaleDate(value: string | number | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(resolveBcp47Locale(locale));
}

export function formatLocaleNumber(value: number, locale: Locale): string {
  return value.toLocaleString(resolveBcp47Locale(locale));
}
