/** Global security headers for Next.js responses */

import { buildContentSecurityPolicy } from './csp.cjs';

/**
 * CSP migration plan (unsafe-eval removal):
 * 1. Production CSP (lib/csp.cjs) omits unsafe-eval (Next.js 14 prod bundles do not require it).
 * 2. Dev/local keeps unsafe-eval for hot reload — set via NODE_ENV.
 * 3. Next step: move inline scripts to nonces (middleware nonce + script-src 'nonce-...').
 * 4. Audit third-party scripts (GTM/GA) for strict-dynamic or tag-manager-only loading.
 *
 * next.config.js and middleware both use the same CSP builder to avoid header drift.
 */

export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: buildContentSecurityPolicy(),
  },
];

export function applySecurityHeaders(response: Response): Response {
  for (const { key, value } of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }
  return response;
}
