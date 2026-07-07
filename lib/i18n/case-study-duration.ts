import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

const DURATION_UNIT_TR: Record<string, string> = {
  day: 'gün',
  days: 'gün',
  week: 'hafta',
  weeks: 'hafta',
  hour: 'saat',
  hours: 'saat',
  hr: 'sa',
  hrs: 'sa',
  minute: 'dakika',
  minutes: 'dakika',
  min: 'dk',
  mins: 'dk',
  month: 'ay',
  months: 'ay',
  year: 'yıl',
  years: 'yıl',
  quarter: 'çeyrek',
  quarters: 'çeyrek',
  cycle: 'döngü',
  cycles: 'döngü',
  design: 'tasarım',
  mo: 'ay',
  show: 'gösteri',
  shows: 'gösteri',
};

export function localizeCaseStudyDurationUnit(unit: string, locale: Locale): string {
  if (locale !== 'tr') return unit;
  return DURATION_UNIT_TR[unit.toLowerCase()] ?? unit;
}

export function localizeCaseStudyDurationInText(text: string, locale: Locale): string {
  if (locale !== 'tr') return text;

  let out = text;

  out = out.replace(
    /from (\d+) days to under (\d+) hours/gi,
    (_, d, h) =>
      `${formatLocaleNumber(Number(d), locale)} günden ${formatLocaleNumber(Number(h), locale)} saate`,
  );

  out = out.replace(
    /under (\d+) minutes/gi,
    (_, m) => `${formatLocaleNumber(Number(m), locale)} dakikadan kısa`,
  );

  out = out.replace(
    /(\d+) hours per week/gi,
    (_, h) => `haftada ${formatLocaleNumber(Number(h), locale)} saat`,
  );

  out = out.replace(
    /in under a day/gi,
    () => 'bir günden kısa sürede',
  );

  out = out.replace(
    /in six months/gi,
    () => 'altı ayda',
  );

  return out;
}

export function formatCaseStudyDurationValue(
  formattedNumber: string,
  unit: string,
  locale: Locale,
): string {
  return `${formattedNumber} ${localizeCaseStudyDurationUnit(unit, locale)}`;
}
