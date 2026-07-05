import { describe, expect, it } from 'vitest';
import {
  PRO_TRIAL_DAYS,
  canStartProTrial,
  isActivePlanGrant,
  isProTrialActive,
  trialDaysRemaining,
} from '@/lib/pro-trial';

const now = new Date('2026-07-01T12:00:00.000Z');

describe('pro-trial', () => {
  it('allows trial for verified free users without paddle subscription', () => {
    expect(
      canStartProTrial(
        {
          id: 'u1',
          plan: 'free',
          emailVerified: now,
          proTrialUsedAt: null,
          planGrantExpiresAt: null,
          paddleSubscriptionId: null,
        },
        now,
      ),
    ).toBe(true);
  });

  it('blocks repeat trials', () => {
    expect(
      canStartProTrial(
        {
          id: 'u1',
          plan: 'free',
          emailVerified: now,
          proTrialUsedAt: now,
          planGrantExpiresAt: null,
          paddleSubscriptionId: null,
        },
        now,
      ),
    ).toBe(false);
  });

  it('detects active trial window', () => {
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + PRO_TRIAL_DAYS);
    expect(isActivePlanGrant(expiresAt, now)).toBe(true);
    expect(trialDaysRemaining(expiresAt, now)).toBe(PRO_TRIAL_DAYS);
    expect(
      isProTrialActive(
        {
          id: 'u1',
          plan: 'pro',
          emailVerified: now,
          proTrialUsedAt: now,
          planGrantExpiresAt: expiresAt,
          paddleSubscriptionId: null,
        },
        now,
      ),
    ).toBe(true);
  });
});
