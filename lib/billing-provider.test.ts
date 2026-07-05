import { describe, expect, it } from 'vitest';
import { activeBillingProvider, isBillingConfigured } from '@/lib/billing-provider';

describe('billing-provider', () => {
  it('returns null when Paddle is not configured', () => {
    const prev = { ...process.env };
    delete process.env.PADDLE_API_KEY;
    delete process.env.PADDLE_PRICE_PRO;
    delete process.env.PADDLE_PRICE_BUSINESS;
    expect(activeBillingProvider()).toBeNull();
    expect(isBillingConfigured()).toBe(false);
    process.env = prev;
  });
});
