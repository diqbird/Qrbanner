import { NextResponse } from 'next/server';
import { SCAN_PAGE_HEADERS } from '@/lib/url-safety';

export function withScanHeaders(res: NextResponse): NextResponse {
  Object.entries(SCAN_PAGE_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function htmlPage(title: string, message: string, status: number) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}div{text-align:center;padding:2rem;max-width:420px}.title{font-size:1.5rem;font-weight:700;color:#1e293b;margin-bottom:.5rem}.desc{color:#64748b;line-height:1.5}a{display:inline-block;margin-top:1rem;color:#4f46e5;text-decoration:none;font-weight:600}</style></head><body><div><p class="title">${title}</p><p class="desc">${message}</p><a href="/">Go to QRbanner</a></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html', ...SCAN_PAGE_HEADERS } }
  );
}

export function passwordPage(code: string, error?: boolean) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Protected QR Code</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}form{text-align:center;padding:2rem;max-width:380px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08)}.icon{width:56px;height:56px;line-height:56px;background:#4f46e5;color:#fff;border-radius:14px;font-size:26px;margin:0 auto 1rem}.title{font-size:1.25rem;font-weight:700;color:#1e293b;margin-bottom:.25rem}.desc{color:#64748b;font-size:.9rem;margin-bottom:1.25rem}input{width:100%;box-sizing:border-box;padding:.75rem 1rem;border:1px solid #e2e8f0;border-radius:10px;font-size:1rem;margin-bottom:.75rem}button{width:100%;padding:.75rem 1rem;background:#4f46e5;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer}.err{color:#dc2626;font-size:.85rem;margin-bottom:.75rem}</style></head><body><form method="POST" action="/s/${code}"><div class="icon">&#128274;</div><p class="title">Password Protected</p><p class="desc">This QR code is protected. Enter the password to continue.</p>${error ? '<p class="err">Incorrect password. Please try again.</p>' : ''}<input type="password" name="password" placeholder="Enter password" autofocus required /><button type="submit">Unlock</button></form></body></html>`,
    { status: error ? 401 : 200, headers: { 'Content-Type': 'text/html' } }
  );
}

export function blockedRedirectPage(): NextResponse {
  return withScanHeaders(
    htmlPage(
      'Link Blocked',
      'This destination was blocked for violating QRbanner acceptable use policy (deceptive or harmful content).',
      451
    )
  );
}

export function draftPreviewPage(): NextResponse {
  return withScanHeaders(
    htmlPage(
      'Preview QR',
      'This is a design preview only. Save your QR code in QRbanner to get a live trackable link before printing or sharing.',
      200
    )
  );
}
