import type { NextRequest } from 'next/server';
import { LOCALE_STORAGE_KEY, type Locale } from './types';

function localeFromValue(value: unknown): Locale | undefined {
  return value === 'tr' ? 'tr' : value === 'en' ? 'en' : undefined;
}

/** Resolve outbound email locale from API body, cookie, referer, or Accept-Language. */
export function resolveEmailLocaleFromRequest(
  req: Pick<NextRequest, 'cookies' | 'headers'>,
  bodyLocale?: unknown,
): Locale {
  const fromBody = localeFromValue(bodyLocale);
  if (fromBody) return fromBody;

  const cookieLocale = req.cookies.get(LOCALE_STORAGE_KEY)?.value;
  if (cookieLocale === 'tr') return 'tr';

  const referer = req.headers.get('referer') ?? '';
  if (/\/tr(\/|$|\?)/.test(referer)) return 'tr';

  const accept = (req.headers.get('accept-language') ?? '').toLowerCase();
  if (accept.startsWith('tr') || accept.includes(',tr')) return 'tr';

  return 'en';
}
