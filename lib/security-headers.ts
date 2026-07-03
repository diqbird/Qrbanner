/** Global security headers for Next.js responses */

/**
 * CSP migration plan (unsafe-eval removal):
 * 1. Production CSP below omits unsafe-eval (Next.js 14 prod bundles do not require it).
 * 2. Dev/local keeps unsafe-eval for hot reload — set via NODE_ENV.
 * 3. Next step: move inline scripts to nonces (middleware nonce + script-src 'nonce-...').
 * 4. Audit third-party scripts (GTM/GA) for strict-dynamic or tag-manager-only loading.
 */
function buildContentSecurityPolicy(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://client.crisp.chat https://challenges.cloudflare.com";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://client.crisp.chat",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.facebook.com https://client.crisp.chat wss://client.relay.crisp.chat wss://relay.crisp.chat",
    "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://www.youtube.com https://www.loom.com https://client.crisp.chat https://challenges.cloudflare.com",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

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
