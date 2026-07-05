/** Public API routes that do not require a session (method + pathname). */
export type PublicApiRoute = { method: string; path: string };

export const PUBLIC_API_ROUTES: PublicApiRoute[] = [
  { method: 'GET', path: '/api/health' },
  { method: 'GET', path: '/api/billing/status' },
  { method: 'GET', path: '/api/site-settings' },
  { method: 'GET', path: '/api/openapi.json' },
  { method: 'GET', path: '/api/marketplace/listings' },
  { method: 'GET', path: '/api/referral/lookup' },
  { method: 'GET', path: '/api/scim/v2/Schemas' },
  { method: 'GET', path: '/api/scim/v2/ServiceProviderConfig' },
  { method: 'POST', path: '/api/billing/webhook' },
  { method: 'POST', path: '/api/auth/forgot-password' },
  { method: 'POST', path: '/api/auth/reset-password' },
  { method: 'POST', path: '/api/signup' },
  { method: 'POST', path: '/api/contact/inquiry' },
  { method: 'POST', path: '/api/leads' },
  { method: 'POST', path: '/api/landing-cta' },
  { method: 'POST', path: '/api/scan/geo' },
  { method: 'POST', path: '/api/verify' },
  { method: 'POST', path: '/api/verify/resend' },
  { method: 'GET', path: '/api/auth/saml/login' },
  { method: 'GET', path: '/api/auth/saml/metadata' },
  { method: 'GET', path: '/api/auth/saml/info' },
  { method: 'GET', path: '/api/auth/sso-policy' },
  { method: 'POST', path: '/api/auth/saml/acs' },
];

const PUBLIC_SET = new Set(PUBLIC_API_ROUTES.map((r) => `${r.method} ${r.path}`));

/** Dynamic segments: /api/marketplace/listings/[id] GET is public for published listings. */
const PUBLIC_PREFIXES: { method: string; prefix: string }[] = [
  { method: 'GET', prefix: '/api/marketplace/listings/' },
  { method: 'GET', prefix: '/api/invite/' },
  { method: 'GET', prefix: '/api/auth/' }, // NextAuth handlers
];

export function hasApiCredentialHeaders(req: { headers: { get(name: string): string | null } }): boolean {
  const auth = req.headers.get('authorization')?.trim();
  if (auth) return true;
  const apiKey = req.headers.get('x-api-key')?.trim();
  return Boolean(apiKey);
}

export function isPublicApiRoute(method: string, pathname: string): boolean {
  const normalizedMethod = method.toUpperCase() === 'HEAD' ? 'GET' : method.toUpperCase();
  const key = `${normalizedMethod} ${pathname}`;
  if (PUBLIC_SET.has(key)) return true;

  const m = normalizedMethod;
  for (const { method: pm, prefix } of PUBLIC_PREFIXES) {
    if (m === pm && pathname.startsWith(prefix)) {
      if (prefix === '/api/auth/') {
        // Sensitive auth routes still require session/MFA in handlers
        if (
          pathname.startsWith('/api/auth/mfa/') &&
          pathname !== '/api/auth/mfa/verify-session'
        ) {
          return false;
        }
        if (
          pathname === '/api/auth/api-key' ||
          pathname === '/api/auth/profile' ||
          pathname === '/api/auth/change-password'
        ) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

export function assertProtectedApiRoute(method: string, pathname: string): void {
  if (isPublicApiRoute(method, pathname)) return;
  // Used by static audit tooling — routes must call requireApiSession/Admin in handler
}
