import { NextResponse } from 'next/server';
import { SCAN_PAGE_HEADERS } from '@/lib/url-safety';
import { resolveScanPageCopy, type ScanPageCopy } from '@/lib/i18n/resolve-scan-page-copy';
import type { Locale } from '@/lib/i18n/types';

export function withScanHeaders(res: NextResponse): NextResponse {
  Object.entries(SCAN_PAGE_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function htmlPage(title: string, message: string, status: number, copy?: ScanPageCopy) {
  const c = copy ?? resolveScanPageCopy('en');
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}div{text-align:center;padding:2rem;max-width:420px}.title{font-size:1.5rem;font-weight:700;color:#1e293b;margin-bottom:.5rem}.desc{color:#64748b;line-height:1.5}a{display:inline-block;margin-top:1rem;color:#4f46e5;text-decoration:none;font-weight:600}</style></head><body><div><p class="title">${title}</p><p class="desc">${message}</p><a href="/">${c.goHome}</a></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html', ...SCAN_PAGE_HEADERS } }
  );
}

export function passwordPage(code: string, error?: boolean, locale: Locale = 'en') {
  const c = resolveScanPageCopy(locale);
  return new NextResponse(
    `<!DOCTYPE html><html lang="${locale}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c.passwordDocTitle}</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}form{text-align:center;padding:2rem;max-width:380px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08)}.icon{width:56px;height:56px;line-height:56px;background:#4f46e5;color:#fff;border-radius:14px;font-size:26px;margin:0 auto 1rem}.title{font-size:1.25rem;font-weight:700;color:#1e293b;margin-bottom:.25rem}.desc{color:#64748b;font-size:.9rem;margin-bottom:1.25rem}input{width:100%;box-sizing:border-box;padding:.75rem 1rem;border:1px solid #e2e8f0;border-radius:10px;font-size:1rem;margin-bottom:.75rem}button{width:100%;padding:.75rem 1rem;background:#4f46e5;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer}.err{color:#dc2626;font-size:.85rem;margin-bottom:.75rem}</style></head><body><form method="POST" action="/s/${code}"><div class="icon">&#128274;</div><p class="title">${c.passwordHeading}</p><p class="desc">${c.passwordDesc}</p>${error ? `<p class="err">${c.passwordError}</p>` : ''}<input type="password" name="password" placeholder="${c.passwordPlaceholder}" autofocus required /><button type="submit">${c.unlock}</button></form></body></html>`,
    { status: error ? 401 : 200, headers: { 'Content-Type': 'text/html' } }
  );
}

export function blockedRedirectPage(locale: Locale = 'en'): NextResponse {
  const c = resolveScanPageCopy(locale);
  return withScanHeaders(htmlPage(c.linkBlockedTitle, c.linkBlockedDesc, 451, c));
}

export function draftPreviewPage(locale: Locale = 'en'): NextResponse {
  const c = resolveScanPageCopy(locale);
  return withScanHeaders(htmlPage(c.draftPreviewTitle, c.draftPreviewDesc, 200, c));
}
