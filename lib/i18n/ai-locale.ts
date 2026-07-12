import { isLocale, type Locale } from '@/lib/i18n/types';

/** Locales supported by campaign / landing / QR-style LLM + template fallbacks. */
export type AiLocale = Locale;

const LANGUAGE_NAME: Record<Locale, string> = {
  en: 'English',
  tr: 'Turkish',
  de: 'German',
  es: 'Spanish',
};

export function parseAiLocale(value: unknown): AiLocale {
  return isLocale(value) ? value : 'en';
}

export function aiLanguageName(locale: AiLocale): string {
  return LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.en;
}

export function pickAiText<T>(
  locale: AiLocale,
  texts: { en: T; tr: T; de: T; es: T },
): T {
  if (locale === 'tr') return texts.tr;
  if (locale === 'de') return texts.de;
  if (locale === 'es') return texts.es;
  return texts.en;
}
