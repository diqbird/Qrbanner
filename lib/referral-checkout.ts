import type { PlanId } from '@/lib/plans';
import type { BillingInterval } from '@/lib/plans';
import { parseBrandingSettings } from '@/lib/referral';
import { canClaimReferralReward, referralRewardCouponId } from '@/lib/referral-stripe';

export function referralCouponForCheckout(
  referralSignupCount: number,
  brandingSettings: unknown,
  plan: PlanId,
  interval: BillingInterval
): string | null {
  if (plan !== 'pro' || interval !== 'monthly') return null;
  const branding = parseBrandingSettings(brandingSettings);
  if (!canClaimReferralReward(referralSignupCount, Boolean(branding.referralRewardClaimed))) {
    return null;
  }
  return referralRewardCouponId();
}

export function referralClaimedBranding(brandingSettings: unknown) {
  const branding = parseBrandingSettings(brandingSettings);
  return { ...branding, referralRewardClaimed: true };
}
