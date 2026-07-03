import type { NextRequest } from 'next/server';

function allowedHosts(): Set<string> {
  const hosts = new Set(['qrbanner.com', 'www.qrbanner.com', 'localhost', '127.0.0.1']);
  for (const raw of [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ]) {
    if (!raw) continue;
    try {
      hosts.add(new URL(raw).hostname.toLowerCase());
      const port = new URL(raw).port;
      if (port) hosts.add(`${new URL(raw).hostname.toLowerCase()}:${port}`);
    } catch {
      /* ignore */
    }
  }
  return hosts;
}

function hostFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.port ? `${parsed.hostname.toLowerCase()}:${parsed.port}` : parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Browser-origin check for public POST endpoints (signup, contact, etc.).
 * Skipped outside production. API-key routes should not use this.
 */
export function assertBrowserOrigin(
  req: NextRequest
): { ok: true } | { ok: false; error: string } {
  if (process.env.NODE_ENV !== 'production') return { ok: true };

  const allowed = allowedHosts();
  const origin = req.headers.get('origin');
  if (origin) {
    const host = hostFromUrl(origin);
    if (host && allowed.has(host)) return { ok: true };
    return { ok: false, error: 'origin_not_allowed' };
  }

  const referer = req.headers.get('referer');
  if (referer) {
    const host = hostFromUrl(referer);
    if (host && allowed.has(host)) return { ok: true };
    return { ok: false, error: 'origin_not_allowed' };
  }

  return { ok: false, error: 'origin_required' };
}
