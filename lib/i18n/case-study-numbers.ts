import { formatLocaleCurrency, formatLocaleDecimal, formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function formatCaseStudyMetricValue(raw: string, locale: Locale): string {
  const trimmed = raw.trim();

  let m = trimmed.match(/^(\+?)(\d+(?:\.\d+)?)%$/);
  if (m) {
    const num = Number(m[2]);
    const formatted = Number.isInteger(num)
      ? formatLocaleNumber(num, locale)
      : formatLocaleDecimal(num, locale, 1);
    return `${m[1]}${formatted}%`;
  }

  m = trimmed.match(/^(\d+(?:\.\d+)?)k(\+)?$/i);
  if (m) {
    const num = Number(m[1]);
    const kPart = Number.isInteger(num)
      ? formatLocaleNumber(num, locale)
      : formatLocaleDecimal(num, locale, 1);
    return `${kPart}k${m[2] ?? ''}`;
  }

  m = trimmed.match(/^([\d,]+)(\+)$/);
  if (m) {
    return `${formatLocaleNumber(Number(m[1].replace(/,/g, '')), locale)}${m[2]}`;
  }

  if (/^\d+$/.test(trimmed)) {
    return formatLocaleNumber(Number(trimmed), locale);
  }

  m = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(.+)$/);
  if (m) {
    const num = Number(m[1]);
    const formatted = Number.isInteger(num)
      ? formatLocaleNumber(num, locale)
      : formatLocaleDecimal(num, locale, 1);
    return `${formatted} / ${m[2]}`;
  }

  m = trimmed.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
  if (m) {
    const num = Number(m[1]);
    const formatted = Number.isInteger(num)
      ? formatLocaleNumber(num, locale)
      : formatLocaleDecimal(num, locale, 1);
    return `${formatted} ${m[2]}`;
  }

  return trimmed;
}

export function localizeCaseStudyProse(text: string, locale: Locale): string {
  let out = text;

  out = out.replace(/~?\$(\d+(?:\.\d+)?)k\b/gi, (full, n) => {
    const prefix = full.startsWith('~') ? '~' : '';
    return `${prefix}${formatLocaleCurrency(Number(n) * 1000, locale, {
      maximumFractionDigits: 0,
      convertTry: true,
    })}`;
  });

  out = out.replace(/\$(\d{1,3}(?:,\d{3})+|\d+)/g, (_, n) =>
    formatLocaleCurrency(Number(String(n).replace(/,/g, '')), locale, {
      maximumFractionDigits: 0,
      convertTry: true,
    }),
  );

  out = out.replace(/\+(\d+(?:\.\d+)?)%/g, (_, n) => {
    const num = Number(n);
    const formatted = Number.isInteger(num)
      ? formatLocaleNumber(num, locale)
      : formatLocaleDecimal(num, locale, 1);
    return `+${formatted}%`;
  });

  out = out.replace(
    /\b(\d{1,4})\s+(locations?|stores?|properties|clinics?|galleries?|stages?|restaurants?)/gi,
    (_, n, word) => `${formatLocaleNumber(Number(n), locale)} ${word}`,
  );

  out = out.replace(/\$(\d+)\s+per\s+location/gi, (_, n) =>
    `${formatLocaleCurrency(Number(n), locale, { maximumFractionDigits: 0, convertTry: true })} per location`,
  );

  out = out.replace(/\b(\d+)\+/g, (_, n) => `${formatLocaleNumber(Number(n), locale)}+`);

  return out;
}

export interface CaseStudyLike {
  headline: string;
  companyType: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: { label: string; value: string }[];
}

export function localizeCaseStudyView<T extends CaseStudyLike>(study: T, locale: Locale): T {
  return {
    ...study,
    headline: localizeCaseStudyProse(study.headline, locale),
    companyType: localizeCaseStudyProse(study.companyType, locale),
    challenge: localizeCaseStudyProse(study.challenge, locale),
    solution: localizeCaseStudyProse(study.solution, locale),
    results: study.results.map((r) => localizeCaseStudyProse(r, locale)),
    metrics: study.metrics.map((m) => ({
      ...m,
      value: formatCaseStudyMetricValue(m.value, locale),
    })),
  };
}

/** Illustrative bulk-migration count cited in review marketing copy. */
export const REVIEW_BULK_MIGRATION_EXAMPLE_COUNT = 400;
