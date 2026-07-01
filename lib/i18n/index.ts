import { en } from './en';
import { tr } from './tr';
import type { Locale, TranslationTree } from './types';
import { getNestedValue, interpolate } from './types';

const dictionaries: Record<Locale, TranslationTree> = { en, tr };

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const primary = getNestedValue(dictionaries[locale], key);
  const fallback = locale !== 'en' ? getNestedValue(dictionaries.en, key) : undefined;
  const value = primary ?? fallback ?? key;
  return interpolate(value, vars);
}

export { dictionaries };
export type { Locale };
export { LOCALES, LOCALE_STORAGE_KEY } from './types';
export {
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  localizePath,
  parseLocalePath,
  pathsMatchLocalized,
  shouldLocalizePath,
} from './locale-path';
