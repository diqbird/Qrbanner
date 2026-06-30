export const REFERRAL_REWARD_MIN_SIGNUPS = 5;

export function referralRewardCouponId(): string | null {
  const id = process.env.STRIPE_REFERRAL_COUPON_ID?.trim();
  return id || null;
}

export function canClaimReferralReward(signupCount: number, claimed: boolean): boolean {
  return signupCount >= REFERRAL_REWARD_MIN_SIGNUPS && !claimed && Boolean(referralRewardCouponId());
}
