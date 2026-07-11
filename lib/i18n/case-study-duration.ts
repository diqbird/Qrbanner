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

const DURATION_UNIT_DE: Record<string, string> = {
  day: 'Tag',
  days: 'Tage',
  week: 'Woche',
  weeks: 'Wochen',
  hour: 'Stunde',
  hours: 'Stunden',
  hr: 'Std.',
  hrs: 'Std.',
  minute: 'Minute',
  minutes: 'Minuten',
  min: 'Min.',
  mins: 'Min.',
  month: 'Monat',
  months: 'Monate',
  year: 'Jahr',
  years: 'Jahre',
  quarter: 'Quartal',
  quarters: 'Quartale',
  cycle: 'Zyklus',
  cycles: 'Zyklen',
  design: 'Design',
  mo: 'Mo.',
  show: 'Show',
  shows: 'Shows',
};

const DURATION_UNIT_ES: Record<string, string> = {
  day: 'día',
  days: 'días',
  week: 'semana',
  weeks: 'semanas',
  hour: 'hora',
  hours: 'horas',
  hr: 'h',
  hrs: 'h',
  minute: 'minuto',
  minutes: 'minutos',
  min: 'min',
  mins: 'min',
  month: 'mes',
  months: 'meses',
  year: 'año',
  years: 'años',
  quarter: 'trimestre',
  quarters: 'trimestres',
  cycle: 'ciclo',
  cycles: 'ciclos',
  design: 'diseño',
  mo: 'mes',
  show: 'función',
  shows: 'funciones',
};

function durationUnits(locale: Locale): Record<string, string> {
  if (locale === 'tr') return DURATION_UNIT_TR;
  if (locale === 'de') return DURATION_UNIT_DE;
  if (locale === 'es') return DURATION_UNIT_ES;
  return {};
}

export function localizeCaseStudyDurationUnit(unit: string, locale: Locale): string {
  if (locale === 'en') return unit;
  return durationUnits(locale)[unit.toLowerCase()] ?? unit;
}

export function localizeCaseStudyDurationInText(text: string, locale: Locale): string {
  if (locale === 'en') return text;

  let out = text;

  if (locale === 'tr') {
    out = out.replace(
      /from (\d+) days to under (\d+) hours/gi,
      (_, d, h) =>
        `${formatLocaleNumber(Number(d), locale)} günden ${formatLocaleNumber(Number(h), locale)} saate`,
    );
    out = out.replace(/under (\d+) minutes/gi, (_, m) => `${formatLocaleNumber(Number(m), locale)} dakikadan kısa`);
    out = out.replace(/(\d+) hours per week/gi, (_, h) => `haftada ${formatLocaleNumber(Number(h), locale)} saat`);
    out = out.replace(/in under a day/gi, () => 'bir günden kısa sürede');
    out = out.replace(/in six months/gi, () => 'altı ayda');
    return out;
  }

  if (locale === 'de') {
    out = out.replace(
      /from (\d+) days to under (\d+) hours/gi,
      (_, d, h) =>
        `von ${formatLocaleNumber(Number(d), locale)} Tagen auf unter ${formatLocaleNumber(Number(h), locale)} Stunden`,
    );
    out = out.replace(/under (\d+) minutes/gi, (_, m) => `unter ${formatLocaleNumber(Number(m), locale)} Minuten`);
    out = out.replace(/(\d+) hours per week/gi, (_, h) => `${formatLocaleNumber(Number(h), locale)} Stunden pro Woche`);
    out = out.replace(/in under a day/gi, () => 'in weniger als einem Tag');
    out = out.replace(/in six months/gi, () => 'in sechs Monaten');
    return out;
  }

  if (locale === 'es') {
    out = out.replace(
      /from (\d+) days to under (\d+) hours/gi,
      (_, d, h) =>
        `de ${formatLocaleNumber(Number(d), locale)} días a menos de ${formatLocaleNumber(Number(h), locale)} horas`,
    );
    out = out.replace(/under (\d+) minutes/gi, (_, m) => `menos de ${formatLocaleNumber(Number(m), locale)} minutos`);
    out = out.replace(/(\d+) hours per week/gi, (_, h) => `${formatLocaleNumber(Number(h), locale)} horas por semana`);
    out = out.replace(/in under a day/gi, () => 'en menos de un día');
    out = out.replace(/in six months/gi, () => 'en seis meses');
    return out;
  }

  return out;
}

export function formatCaseStudyDurationValue(
  formattedNumber: string,
  unit: string,
  locale: Locale,
): string {
  return `${formattedNumber} ${localizeCaseStudyDurationUnit(unit, locale)}`;
}
