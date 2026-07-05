import { describe, expect, it } from 'vitest';
import { hasApiCredentialHeaders, isPublicApiRoute } from '@/lib/api-public-routes';

describe('api-public-routes', () => {
  it('marks health and signup as public', () => {
    expect(isPublicApiRoute('GET', '/api/health')).toBe(true);
    expect(isPublicApiRoute('POST', '/api/signup')).toBe(true);
  });

  it('marks dashboard routes as protected', () => {
    expect(isPublicApiRoute('GET', '/api/qr')).toBe(false);
    expect(isPublicApiRoute('GET', '/api/admin/stats')).toBe(false);
  });

  it('allows NextAuth session endpoint', () => {
    expect(isPublicApiRoute('GET', '/api/auth/session')).toBe(true);
  });

  it('treats invite lookup GET as public', () => {
    expect(isPublicApiRoute('GET', '/api/invite/abc-token')).toBe(true);
    expect(isPublicApiRoute('POST', '/api/invite/abc-token')).toBe(false);
  });

  it('detects credential headers', () => {
    expect(hasApiCredentialHeaders({ headers: { get: () => null } })).toBe(false);
    expect(
      hasApiCredentialHeaders({ headers: { get: (n) => (n === 'authorization' ? 'Bearer x' : null) } })
    ).toBe(true);
    expect(
      hasApiCredentialHeaders({ headers: { get: (n) => (n === 'x-api-key' ? 'qrb_abc' : null) } })
    ).toBe(true);
  });
});
