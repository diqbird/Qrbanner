import { parseBrandingSettings } from '@/lib/referral';

export function referralClaimedBranding(brandingSettings: unknown) {
  const branding = parseBrandingSettings(brandingSettings);
  return { ...branding, referralRewardClaimed: true };
}
