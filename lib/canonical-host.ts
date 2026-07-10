import { normalizeDomain } from '@/lib/app-host';

export const CANONICAL_SITE_HOST = 'qrbanner.com';export function wwwToApexRedirectUrl(requestUrl: URL, host: string | null | undefined): URL | null {
  if (!host) return null;
  const normalized = normalizeDomain(host.split(':')[0]);
  if (normalized !== `www.${CANONICAL_SITE_HOST}`) return null;

  // Build from a clean apex base — req.nextUrl behind nginx may still carry :3000.
  return new URL(
    `${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`,
    `https://${CANONICAL_SITE_HOST}/`,
  );
}
