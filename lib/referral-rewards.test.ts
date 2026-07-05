import { describe, expect, it } from 'vitest';
import { canClaimReferralReward, getReferralRewardProgress } from '@/lib/referral-rewards';

describe('referral-rewards', () => {
  it('tracks milestone progress', () => {
    const p = getReferralRewardProgress(4);
    expect(p.nextMilestone).toBe(5);
    expect(p.progressPercent).toBe(80);
  });

  it('allows claim at 5 signups when not claimed', () => {
    expect(canClaimReferralReward(5, false)).toBe(true);
    expect(canClaimReferralReward(5, true)).toBe(false);
    expect(canClaimReferralReward(4, false)).toBe(false);
  });
});
