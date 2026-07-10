import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

import { wwwToApexRedirectUrl } from '@/lib/canonical-host';
import { isAppHost } from '@/lib/app-host';
import { applySecurityHeaders } from '@/lib/security-headers';
import { hasApiCredentialHeaders, isPublicApiRoute } from '@/lib/api-public-routes';
import { LOCALE_HEADER, PATHNAME_HEADER, parseLocalePath, isEnglishOnlyPublicPath } from '@/lib/i18n/locale-path';
import { LOCALE_STORAGE_KEY, isLocale, type Locale } from '@/lib/i18n/types';
import { isMfaExemptApiPath } from '@/lib/api-mfa-exempt';

const PROTECTED_PREFIXES = ['/dashboard', '/settings', '/qr/bulk', '/admin'];

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isProtectedPath(path: string): boolean {
  if (path === '/qr/create' || path === '/qr/campaign') return false;
  if (PROTECTED_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (/^\/qr\/[^/]+/.test(path)) return true;
  return false;
}

function applyLocaleCookie(res: NextResponse, locale: Locale) {
  res.cookies.set(LOCALE_STORAGE_KEY, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  res.headers.set(LOCALE_HEADER, locale);
}

function withSecurityHeaders<T extends NextResponse>(res: T): T {
  applySecurityHeaders(res);
  return res;
}

function resolveRequestLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get(LOCALE_STORAGE_KEY)?.value;
  return isLocale(cookieLocale) ? cookieLocale : 'en';
}

function finish(req: NextRequest, res: NextResponse): NextResponse {
  res.headers.set(PATHNAME_HEADER, req.nextUrl.pathname);
  if (!res.headers.get(LOCALE_HEADER)) {
    res.headers.set(LOCALE_HEADER, resolveRequestLocale(req));
  }
  return withSecurityHeaders(res);
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
  const res = NextResponse.rewrite(rewriteUrl);
  applyLocaleCookie(res, locale);
  return finish(req, res);
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
      return finish(req, NextResponse.next());
    }
    return NextResponse.redirect('https://qrbanner.com');
  }

  const localeResponse = handleLocaleRouting(req);
  if (localeResponse) return localeResponse;

  const path = parseLocalePath(req.nextUrl.pathname).pathname;

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
      return finish(
        req,
        NextResponse.json({ error: 'mfa_required' }, { status: 403 })
      );
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
        return finish(
          req,
          NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        );
      }
    }
  }

  return finish(req, NextResponse.next());
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon|opengraph-image).*)',
  ],
};
