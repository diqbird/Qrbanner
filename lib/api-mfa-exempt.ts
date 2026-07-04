/** API paths that must work without MFA step-up (public, auth bootstrap, webhooks). */
const MFA_EXEMPT_API_PREFIXES = [
  '/api/signup',
  '/api/verify',
  '/api/billing/webhook',
  '/api/billing/status',
  '/api/public',
  '/api/leads',
  '/api/scan/geo',
  '/api/openapi.json',
  '/api/site-settings',
  '/api/scim',
  '/api/saml',
  '/api/cron',
];

/** Public or MFA step-up routes under /api/auth — not the whole /api/auth tree. */
const MFA_EXEMPT_AUTH_EXACT = new Set([
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/mfa/verify-session',
]);

/** Sensitive /api/auth routes that require completed MFA step-up. */
const MFA_REQUIRED_AUTH_EXACT = new Set([
  '/api/auth/api-key',
  '/api/auth/profile',
  '/api/auth/change-password',
  '/api/auth/mfa',
  '/api/auth/mfa/setup',
  '/api/auth/mfa/enable',
  '/api/auth/mfa/disable',
]);

function isNextAuthHandlerPath(pathname: string): boolean {
  if (!pathname.startsWith('/api/auth/')) return false;
  if (MFA_REQUIRED_AUTH_EXACT.has(pathname)) return false;
  if (MFA_EXEMPT_AUTH_EXACT.has(pathname)) return true;
  // NextAuth: /api/auth/signin, /api/auth/session, /api/auth/callback/*, etc.
  if (pathname.startsWith('/api/auth/saml/')) return true;
  if (pathname === '/api/auth/sso-policy') return true;
  return !pathname.startsWith('/api/auth/mfa/');
}

export function isMfaExemptApiPath(pathname: string): boolean {
  if (MFA_EXEMPT_AUTH_EXACT.has(pathname)) return true;
  if (isNextAuthHandlerPath(pathname)) return true;
  return MFA_EXEMPT_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isMfaRequiredAuthPath(pathname: string): boolean {
  return MFA_REQUIRED_AUTH_EXACT.has(pathname);
}
