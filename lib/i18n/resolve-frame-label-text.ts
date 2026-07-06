import { en } from './en';
import { tr } from './tr';
import { getNestedValue } from './types';
import type { Locale } from './types';

const EN_SCAN_ME = getNestedValue(en, 'style.frameTextPresetText.scanMe') ?? 'Scan me';

export function resolveDefaultFrameText(locale: Locale = 'en'): string {
  const tree = locale === 'tr' ? tr : en;
  return getNestedValue(tree, 'style.frameTextPresetText.scanMe') ?? EN_SCAN_ME;
}

/** Resolve frame label for canvas render — empty or English factory default → locale copy. */
export function resolveFrameLabelText(frameText: string | undefined | null, locale: Locale = 'en'): string {
  const trimmed = (frameText ?? '').trim();
  if (!trimmed || trimmed === EN_SCAN_ME) {
    return resolveDefaultFrameText(locale);
  }
  return trimmed.slice(0, 32);
}
