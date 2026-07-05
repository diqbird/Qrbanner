import { describe, expect, it } from 'vitest';
import { buildPublicHealthResponse, healthDetailAuthorized } from '@/lib/health-response';

describe('health-response', () => {
  it('builds minimal public payload', () => {
    const body = buildPublicHealthResponse({ dbOk: true, started: Date.now() - 12 });
    expect(body.ok).toBe(true);
    expect(body.status).toBe('operational');
    expect('checks' in body).toBe(false);
  });

  it('rejects detail without secret', () => {
    const prev = process.env.HEALTH_DETAIL_SECRET;
    process.env.HEALTH_DETAIL_SECRET = 'test-secret';
    const req = new Request('https://qrbanner.com/api/health');
    expect(healthDetailAuthorized(req)).toBe(false);
    process.env.HEALTH_DETAIL_SECRET = prev;
  });
});
