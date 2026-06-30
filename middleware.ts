import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

import { isAppHost } from '@/lib/custom-domain';
import { applySecurityHeaders } from '@/lib/security-headers';



const PROTECTED_PREFIXES = ['/dashboard', '/settings', '/qr/bulk', '/admin'];



function isProtectedPath(path: string): boolean {

  if (path === '/qr/create') return false;

  if (PROTECTED_PREFIXES.some((p) => path.startsWith(p))) return true;

  // /qr/[id] edit pages — not /qr/create

  if (/^\/qr\/[^/]+/.test(path)) return true;

  return false;

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



  const path = req.nextUrl.pathname;



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

