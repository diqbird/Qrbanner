import { describe, expect, it } from 'vitest';
import { isPaddleConfigured, isPaddleFullyConfigured, listPaddleEnvGaps } from '@/lib/paddle';

describe('paddle env helpers', () => {
  it('lists missing Paddle keys', () => {
    const prev = { ...process.env };
    delete process.env.PADDLE_API_KEY;
    delete process.env.PADDLE_PRICE_AGENCY_ANNUAL;
    expect(listPaddleEnvGaps()).toContain('PADDLE_API_KEY');
    expect(listPaddleEnvGaps()).toContain('PADDLE_PRICE_AGENCY_ANNUAL');
    process.env = prev;
  });

  it('requires core keys for isPaddleConfigured', () => {
    const prev = { ...process.env };
    process.env.PADDLE_API_KEY = 'key';
    process.env.PADDLE_CLIENT_TOKEN = 'token';
    process.env.PADDLE_PRICE_PRO = 'pri_pro';
    process.env.PADDLE_PRICE_BUSINESS = 'pri_business';
    expect(isPaddleConfigured()).toBe(true);
    delete process.env.PADDLE_CLIENT_TOKEN;
    expect(isPaddleConfigured()).toBe(false);
    process.env = prev;
  });

  it('requires every price id for isPaddleFullyConfigured', () => {
    const prev = { ...process.env };
    for (const key of listPaddleEnvGaps()) {
      process.env[key] = 'set';
    }
    expect(isPaddleFullyConfigured()).toBe(true);
    delete process.env.PADDLE_PRICE_AGENCY;
    expect(isPaddleFullyConfigured()).toBe(false);
    process.env = prev;
  });
});
