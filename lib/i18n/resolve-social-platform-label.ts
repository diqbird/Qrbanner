import { en } from './en';
import { tr } from './tr';
import { getNestedValue } from './types';
import type { Locale } from './types';

export function resolveSocialPlatformLabel(platform: string, locale: Locale = 'en'): string {
  const tree = locale === 'tr' ? tr : en;
  return getNestedValue(tree, `landingBuilder.social.${platform}`) ?? platform;
}
