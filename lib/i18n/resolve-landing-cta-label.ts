import { resolveScanLandingCopy } from './resolve-scan-page-copy';
import type { Locale } from './types';

/** Resolve landing CTA for display — empty or English factory default → locale copy. */
export function resolveLandingCtaLabel(ctaLabel: string | undefined | null, locale: Locale = 'en'): string {
  const trimmed = (ctaLabel ?? '').trim();
  const englishDefault = resolveScanLandingCopy('en').defaultCta;
  if (!trimmed || trimmed === englishDefault) {
    return resolveScanLandingCopy(locale).defaultCta;
  }
  return trimmed;
}
