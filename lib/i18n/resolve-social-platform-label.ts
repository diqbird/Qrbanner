import { getNestedValue } from './types';
import type { Locale } from './types';
import { dictionaryFor } from './locale-dictionary';

export function resolveSocialPlatformLabel(platform: string, locale: Locale = 'en'): string {
  return getNestedValue(dictionaryFor(locale), `landingBuilder.social.${platform}`) ?? platform;
}
