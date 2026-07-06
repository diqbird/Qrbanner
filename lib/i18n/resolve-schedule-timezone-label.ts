import { en } from './en';
import { tr } from './tr';
import type { Locale, TranslationTree } from './types';
import { TIMEZONE_OPTIONS } from '@/lib/schedule-utils';

function scheduleTimezones(tree: TranslationTree): Record<string, string> | undefined {
  const qrFeatures = tree.qrFeatures;
  if (!qrFeatures || typeof qrFeatures === 'string') return undefined;
  const timezones = qrFeatures.scheduleTimezones;
  if (!timezones || typeof timezones === 'string') return undefined;
  return timezones as Record<string, string>;
}

export function resolveScheduleTimezoneLabel(value: string, locale: Locale = 'en'): string {
  const tree = locale === 'tr' ? tr : en;
  const localized = scheduleTimezones(tree)?.[value];
  if (localized) return localized;
  return TIMEZONE_OPTIONS.find((tz) => tz.value === value)?.label ?? value;
}
