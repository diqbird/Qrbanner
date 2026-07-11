import { de } from './de';
import { en } from './en';
import { es } from './es';
import { tr } from './tr';
import type { Locale, TranslationTree } from './types';

export const localeDictionaries: Record<Locale, TranslationTree> = { en, tr, de, es };

export function dictionaryFor(locale: Locale): TranslationTree {
  return localeDictionaries[locale] ?? en;
}

export function intlLocaleTag(locale: Locale): string {
  if (locale === 'tr') return 'tr';
  if (locale === 'de') return 'de';
  if (locale === 'es') return 'es';
  return 'en';
}
