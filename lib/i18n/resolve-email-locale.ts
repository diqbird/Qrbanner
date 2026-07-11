import type { NextRequest } from 'next/server';
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from './types';

function localeFromValue(value: unknown): Locale | undefined {
  return isLocale(value) ? value : undefined;
}

function localeFromAcceptLanguage(header: string): Locale | undefined {
  const accept = header.toLowerCase();
  if (accept.startsWith('tr') || accept.includes(',tr')) return 'tr';
  if (accept.startsWith('de') || accept.includes(',de')) return 'de';
  if (accept.startsWith('es') || accept.includes(',es')) return 'es';
  return undefined;
}

function localeFromReferer(referer: string): Locale | undefined {
  if (/\/tr(\/|$|\?)/.test(referer)) return 'tr';
  if (/\/de(\/|$|\?)/.test(referer)) return 'de';
  if (/\/es(\/|$|\?)/.test(referer)) return 'es';
  return undefined;
}

/** Resolve outbound email locale from API body, cookie, referer, or Accept-Language. */
export function resolveEmailLocaleFromRequest(
  req: Pick<NextRequest, 'cookies' | 'headers'>,
  bodyLocale?: unknown,
): Locale {
  const fromBody = localeFromValue(bodyLocale);
  if (fromBody) return fromBody;

  const cookieLocale = req.cookies.get(LOCALE_STORAGE_KEY)?.value;
  const fromCookie = localeFromValue(cookieLocale);
  if (fromCookie) return fromCookie;

  const referer = req.headers.get('referer') ?? '';
  const fromReferer = localeFromReferer(referer);
  if (fromReferer) return fromReferer;

  const fromAccept = localeFromAcceptLanguage(req.headers.get('accept-language') ?? '');
  if (fromAccept) return fromAccept;

  return 'en';
}
