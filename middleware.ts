import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

import { isAppHost } from '@/lib/custom-domain';
import { applySecurityHeaders } from '@/lib/security-headers';
import { LOCALE_HEADER, parseLocalePath } from '@/lib/i18n/locale-path';
import { LOCALE_STORAGE_KEY } from '@/lib/i18n/types';

const PROTECTED_PREFIXES = ['/dashboard', '/settings', '/qr/bulk', '/admin'];

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isProtectedPath(path: string): boolean {
  if (path === '/qr/create') return false;
  if (PROTECTED_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (/^\/qr\/[^/]+/.test(path)) return true;
  return false;
}

function applyLocaleCookie(res: NextResponse, locale: 'en' | 'tr') {
  res.cookies.set(LOCALE_STORAGE_KEY, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  res.headers.set(LOCALE_HEADER, locale);
}

function handleLocaleRouting(req: NextRequest): NextResponse | null {
  const { locale, pathname } = parseLocalePath(req.nextUrl.pathname);
  if (!locale) return null;

  if (pathname.startsWith('/s/')) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = pathname;
    return applySecurityHeaders(NextResponse.redirect(redirect));
  }

  if (locale === 'en') {
    const redirect = req.nextUrl.clone();
    redirect.pathname = pathname;
    const res = NextResponse.redirect(redirect);
    applyLocaleCookie(res, 'en');
    return applySecurityHeaders(res);
  }

  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = pathname;
  const res = NextResponse.rewrite(rewriteUrl);
  applyLocaleCookie(res, 'tr');
  return applySecurityHeaders(res);
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if (!isAppHost(host)) {
    const path = req.nextUrl.pathname;
    if (path.startsWith('/s/')) {
      return applySecurityHeaders(NextResponse.next());
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

    if (!token) {
      const login = new URL('/login', req.url);
      login.searchParams.set('callbackUrl', path + req.nextUrl.search);
      return applySecurityHeaders(NextResponse.redirect(login));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon|opengraph-image).*)'],
};
