import type { NextRequest } from 'next/server';
import { siteBaseUrl } from '@/lib/billing-provider';

/** Build absolute site URL from proxy headers (avoids localhost req.url on VPS). */
export function absoluteSitePath(req: NextRequest, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = (forwardedHost ?? req.headers.get('host'))?.split(',')[0]?.trim();
  const proto = (req.headers.get('x-forwarded-proto') ?? 'https').split(',')[0].trim();

  if (host) {
    const lower = host.toLowerCase();
    if (!lower.startsWith('localhost') && !lower.startsWith('127.0.0.1')) {
      return `${proto}://${host}${normalizedPath}`;
    }
  }

  return `${siteBaseUrl()}${normalizedPath}`;
}
