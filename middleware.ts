import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

import { wwwToApexRedirectUrl } from '@/lib/canonical-host';
import { isAppHost } from '@/lib/app-host';
import { applySecurityHeaders } from '@/lib/security-headers';
import { hasApiCredentialHeaders, isPublicApiRoute } from '@/lib/api-public-routes';
import {
  LOCALE_HEADER,
  PATHNAME_HEADER,
  parseLocalePath,
  isEnglishOnlyPublicPath,
  shouldLocalizePath,
  localizePath,
} from '@/lib/i18n/locale-path';
import { LOCALE_STORAGE_KEY, isLocale, type Locale } from '@/lib/i18n/types';
import { isMfaExemptApiPath } from '@/lib/api-mfa-exempt';

const PROTECTED_PREFIXES = ['/dashboard', '/settings', '/qr/bulk', '/admin'];

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Request/response header Next.js reads for Script nonce propagation. */
export const CSP_NONCE_HEADER = 'x-nonce';

function isProtectedPath(path: string): boolean {
  if (path === '/qr/create' || path === '/qr/campaign') return false;
  if (PROTECTED_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (/^\/qr\/[^/]+/.test(path)) return true;
  return false;
}

function createCspNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function requestHeadersWithNonce(req: NextRequest, nonce: string): Headers {
  const headers = new Headers(req.headers);
  headers.set(CSP_NONCE_HEADER, nonce);
  return headers;
}

function applyLocaleCookie(res: NextResponse, locale: Locale) {
  res.cookies.set(LOCALE_STORAGE_KEY, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  res.headers.set(LOCALE_HEADER, locale);
}

function finish(req: NextRequest, res: NextResponse, nonce = createCspNonce()): NextResponse {
  res.headers.set(PATHNAME_HEADER, req.nextUrl.pathname);
  if (!res.headers.get(LOCALE_HEADER)) {
    res.headers.set(LOCALE_HEADER, resolveRequestLocale(req));
  }
  res.headers.set(CSP_NONCE_HEADER, nonce);
  applySecurityHeaders(res, { nonce });
  return res;
}

function nextWithNonce(req: NextRequest): { res: NextResponse; nonce: string } {
  const nonce = createCspNonce();
  const res = NextResponse.next({
    request: { headers: requestHeadersWithNonce(req, nonce) },
  });
  return { res, nonce };
}

function rewriteWithNonce(req: NextRequest, url: URL): { res: NextResponse; nonce: string } {
  const nonce = createCspNonce();
  const res = NextResponse.rewrite(url, {
    request: { headers: requestHeadersWithNonce(req, nonce) },
  });
  return { res, nonce };
}

function resolveRequestLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(LOCALE_STORAGE_KEY)?.value;
  return isLocale(cookieLocale) ? cookieLocale : 'en';
}

function handleLocaleRouting(req: NextRequest): NextResponse | null {
  const { locale, pathname } = parseLocalePath(req.nextUrl.pathname);
  if (!locale) return null;

  if (pathname.startsWith('/s/')) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = pathname;
    return finish(req, NextResponse.redirect(redirect));
  }

  if (isEnglishOnlyPublicPath(pathname)) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = pathname;
    const res = NextResponse.redirect(redirect, 308);
    applyLocaleCookie(res, locale);
    return finish(req, res);
  }

  if (locale === 'en') {
    const redirect = req.nextUrl.clone();
    redirect.pathname = pathname;
    const res = NextResponse.redirect(redirect);
    applyLocaleCookie(res, 'en');
    return finish(req, res);
  }

  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = pathname;
  const { res, nonce } = rewriteWithNonce(req, rewriteUrl);
  applyLocaleCookie(res, locale);
  return finish(req, res, nonce);
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host');

  const apexRedirect = wwwToApexRedirectUrl(req.nextUrl, host);
  if (apexRedirect) {
    return finish(req, NextResponse.redirect(apexRedirect, 301));
  }

  if (!isAppHost(host)) {
    const path = req.nextUrl.pathname;
    if (path.startsWith('/s/')) {
      const { res, nonce } = nextWithNonce(req);
      return finish(req, res, nonce);
    }
    return NextResponse.redirect('https://qrbanner.com');
  }

  const localeResponse = handleLocaleRouting(req);
  if (localeResponse) return localeResponse;

  const path = parseLocalePath(req.nextUrl.pathname).pathname;

  // Cookie locale TR/DE/ES + unprefixed public URL → 308 to prefixed URL so
  // visible URL matches canonical/hreflang (avoids soft-canonical mismatch).
  if (req.method === 'GET' || req.method === 'HEAD') {
    const cookieLocale = resolveRequestLocale(req);
    if (cookieLocale !== 'en' && !path.startsWith('/api/') && shouldLocalizePath(path)) {
      const localizedPathname = localizePath(path, cookieLocale);
      if (localizedPathname !== req.nextUrl.pathname) {
        const redirect = req.nextUrl.clone();
        redirect.pathname = localizedPathname;
        return finish(req, NextResponse.redirect(redirect, 308));
      }
    }
  }

  if (isProtectedPath(path)) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.sessionInvalid) {
      const login = new URL('/login', req.url);
      login.searchParams.set('callbackUrl', path + req.nextUrl.search);
      return finish(req, NextResponse.redirect(login));
    }

    if (token.mfaVerified === false && path !== '/mfa-verify') {
      const verify = new URL('/mfa-verify', req.url);
      verify.searchParams.set('callbackUrl', path + req.nextUrl.search);
      return finish(req, NextResponse.redirect(verify));
    }
  }

  if (path === '/mfa-verify') {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      const login = new URL('/login', req.url);
      return finish(req, NextResponse.redirect(login));
    }
    if (token.mfaVerified !== false) {
      const dest = req.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return finish(req, NextResponse.redirect(new URL(dest, req.url)));
    }
  }

  if (path.startsWith('/api/') && !isMfaExemptApiPath(path)) {
    const inviteLookup = req.method === 'GET' && /^\/api\/invite\/[^/]+$/.test(path);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token && token.mfaVerified === false && !inviteLookup) {
      return finish(req, NextResponse.json({ error: 'mfa_required' }, { status: 403 }));
    }
  }

  if (path.startsWith('/api/')) {
    const apiMethod = req.method === 'HEAD' ? 'GET' : req.method;
    if (!isPublicApiRoute(apiMethod, path)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token && !hasApiCredentialHeaders(req)) {
        return finish(req, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }
    }
  }

  const { res, nonce } = nextWithNonce(req);
  return finish(req, res, nonce);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms\\.txt|llms-full\\.txt|manifest.webmanifest|icon|opengraph-image).*)',
  ],
};
