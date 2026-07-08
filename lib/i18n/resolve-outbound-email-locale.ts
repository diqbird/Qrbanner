import type { NextRequest } from 'next/server';
import { parseBrandingSettings } from '@/lib/referral';
import { resolveEmailLocaleFromRequest } from '@/lib/i18n/resolve-email-locale';
import type { Locale } from './types';

/** Prefer stored user locale, then request/cookie locale, then English. */
export function resolveOutboundEmailLocale(
  brandingSettings: unknown,
  requestLocale?: Locale,
): Locale {
  const preferred = parseBrandingSettings(brandingSettings).preferredLocale;
  if (preferred) return preferred;
  if (requestLocale) return requestLocale;
  return 'en';
}

export function resolveOutboundEmailLocaleFromRequest(
  req: Pick<NextRequest, 'cookies' | 'headers'>,
  brandingSettings: unknown,
  bodyLocale?: unknown,
): Locale {
  const requestLocale = resolveEmailLocaleFromRequest(req, bodyLocale);
  return resolveOutboundEmailLocale(brandingSettings, requestLocale);
}
