import type { Locale, TranslationTree } from './types';
import { TIMEZONE_OPTIONS } from '@/lib/schedule-utils';
import { dictionaryFor } from './locale-dictionary';

function scheduleTimezones(tree: TranslationTree): Record<string, string> | undefined {
  const qrFeatures = tree.qrFeatures;
  if (!qrFeatures || typeof qrFeatures === 'string') return undefined;
  const timezones = qrFeatures.scheduleTimezones;
  if (!timezones || typeof timezones === 'string') return undefined;
  return timezones as Record<string, string>;
}

export function resolveScheduleTimezoneLabel(value: string, locale: Locale = 'en'): string {
  const localized = scheduleTimezones(dictionaryFor(locale))?.[value];
  if (localized) return localized;
  return TIMEZONE_OPTIONS.find((tz) => tz.value === value)?.label ?? value;
}
