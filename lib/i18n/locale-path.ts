import type { Locale } from './types';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_HEADER = 'x-qrb-locale';
export const PATHNAME_HEADER = 'x-qrb-pathname';

const LOCALE_SEGMENT = /^\/(tr|en|de|es)(?=\/|$)/;

/** Routes that stay on unprefixed URLs and have no Turkish content alternate. */
const ENGLISH_ONLY_PREFIXES = ['/blog'];

/** App/auth routes keep unprefixed URLs even when locale is Turkish. */
const NON_LOCALIZED_PREFIXES = [
  ...ENGLISH_ONLY_PREFIXES,
  '/dashboard',
  '/settings',
  '/login',
  '/signup',
  '/admin',
  '/invite',
  '/reset-password',
  '/verify',
  '/qr/create',
  '/qr/bulk',
  '/studio',
  '/s/',
];

export function parseLocalePath(pathname: string): {
  locale: Locale | null;
  pathname: string;
} {
  const match = pathname.match(LOCALE_SEGMENT);
  if (!match) {
    return { locale: null, pathname };
  }

  const locale = match[1] as Locale;
  const rest = pathname.slice(match[0].length) || '/';
  const normalized = rest.startsWith('/') ? rest : `/${rest}`;
  return { locale, pathname: normalized === '' ? '/' : normalized };
}

export function shouldLocalizePath(pathname: string): boolean {
  if (!pathname || pathname.startsWith('/s/')) return false;
  return !NON_LOCALIZED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix)
  );
}

/** English-only marketing content — strip /tr/ prefix so hreflang does not claim a TR alternate. */
export function isEnglishOnlyPublicPath(pathname: string): boolean {
  return ENGLISH_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function localizePath(path: string, locale: Locale): string {
  const [pathname, ...searchParts] = path.split('?');
  const search = searchParts.length ? `?${searchParts.join('?')}` : '';

  if (locale === DEFAULT_LOCALE || !shouldLocalizePath(pathname)) {
    return path;
  }

  if (pathname === '/') {
    return `/${locale}${search}`;
  }

  return `/${locale}${pathname}${search}`;
}

export function pathsMatchLocalized(pathname: string, href: string): boolean {
  const a = parseLocalePath(pathname).pathname;
  const b = parseLocalePath(href).pathname;
  return a === b || a.startsWith(`${b}/`);
}
