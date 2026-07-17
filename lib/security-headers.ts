/** Global security headers for Next.js responses */

import { buildContentSecurityPolicy } from './csp.cjs';

/**
 * CSP migration plan:
 * 1. Production CSP omits unsafe-eval (Next.js 14 prod bundles do not require it).
 * 2. Dev/local keeps unsafe-eval for hot reload — set via NODE_ENV.
 * 3. Per-request script nonces + 'strict-dynamic' (middleware) — see applySecurityHeaders / lib/csp.cjs.
 * 4. If console shows CSP script violations after deploy, widen allowlists or fix missing nonces.
 *
 * Enforcing CSP with nonce is set only in middleware so each HTML response gets a
 * unique nonce. next.config.js keeps a static no-nonce CSP for middleware-skipped
 * static routes (robots, sitemap, llms.txt, icons).
 */

export const SECURITY_HEADERS_BASE: { key: string; value: string }[] = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=(self), interest-cohort=()',
  },
];

/** @deprecated Prefer SECURITY_HEADERS_BASE + applySecurityHeaders(res, { nonce }). */
export const SECURITY_HEADERS: { key: string; value: string }[] = [
  ...SECURITY_HEADERS_BASE,
  {
    key: 'Content-Security-Policy',
    value: buildContentSecurityPolicy(),
  },
];

export function applySecurityHeaders(
  response: Response,
  options?: { nonce?: string }
): Response {
  for (const { key, value } of SECURITY_HEADERS_BASE) {
    response.headers.set(key, value);
  }
  response.headers.set(
    'Content-Security-Policy',
    buildContentSecurityPolicy({ nonce: options?.nonce })
  );
  return response;
}
