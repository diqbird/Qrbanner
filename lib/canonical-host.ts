import { normalizeDomain } from '@/lib/custom-domain';

export const CANONICAL_SITE_HOST = 'qrbanner.com';

/** Returns a redirect URL when the request host is www.qrbanner.com. */
export function wwwToApexRedirectUrl(requestUrl: URL, host: string | null | undefined): URL | null {
  if (!host) return null;
  const normalized = normalizeDomain(host.split(':')[0]);
  if (normalized !== `www.${CANONICAL_SITE_HOST}`) return null;

  const url = new URL(requestUrl);
  url.protocol = 'https:';
  url.host = CANONICAL_SITE_HOST;
  return url;
}
