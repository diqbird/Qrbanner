import { en } from './en';
import { getNestedValue } from './types';
import type { Locale } from './types';
import { dictionaryFor } from './locale-dictionary';

const EN_SCAN_ME = getNestedValue(en, 'style.frameTextPresetText.scanMe') ?? 'Scan me';

export function resolveDefaultFrameText(locale: Locale = 'en'): string {
  return getNestedValue(dictionaryFor(locale), 'style.frameTextPresetText.scanMe') ?? EN_SCAN_ME;
}

/** Resolve frame label for canvas render — empty or English factory default → locale copy. */
export function resolveFrameLabelText(frameText: string | undefined | null, locale: Locale = 'en'): string {
  const trimmed = (frameText ?? '').trim();
  if (!trimmed || trimmed === EN_SCAN_ME) {
    return resolveDefaultFrameText(locale);
  }
  return trimmed.slice(0, 32);
}
