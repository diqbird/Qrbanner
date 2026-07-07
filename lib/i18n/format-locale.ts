import type { Locale } from './types';

export function resolveBcp47Locale(locale: Locale): string {
  return locale === 'tr' ? 'tr-TR' : 'en-US';
}

export function formatLocaleDateTime(value: string | number | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString(resolveBcp47Locale(locale));
}

export function formatLocaleDate(
  value: string | number | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(resolveBcp47Locale(locale), options);
}

export function formatLocaleNumber(value: number, locale: Locale): string {
  return value.toLocaleString(resolveBcp47Locale(locale));
}

export function formatLocaleDecimal(
  value: number,
  locale: Locale,
  maximumFractionDigits = 1,
): string {
  return value.toLocaleString(resolveBcp47Locale(locale), { maximumFractionDigits });
}

const TRY_PER_USD_ESTIMATE = 34;

export function formatLocaleCurrency(
  value: number,
  locale: Locale,
  options?: { maximumFractionDigits?: number; convertTry?: boolean },
): string {
  const currency = locale === 'tr' ? 'TRY' : 'USD';
  const rate = options?.convertTry && locale === 'tr' ? TRY_PER_USD_ESTIMATE : 1;
  return (value * rate).toLocaleString(resolveBcp47Locale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });
}

export function formatLocaleNumberList(
  values: number[],
  locale: Locale,
  separator = ', ',
): string {
  return values.map((v) => formatLocaleNumber(v, locale)).join(separator);
}

export function formatChartAxisTick(value: number | string, locale: Locale): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(n)) return formatLocaleNumber(n, locale);
  return String(value);
}

export function formatChartTooltipValue(
  value: number | string | Array<number | string>,
  locale: Locale,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (Number.isFinite(n)) return formatLocaleNumber(n, locale);
  return String(raw ?? '');
}
