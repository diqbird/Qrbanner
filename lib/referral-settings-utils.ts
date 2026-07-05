import { getReferralRewardProgress } from '@/lib/referral-rewards';

export type ReferralSettingsData = {
  link: string;
  signupCount: number;
  rewards: ReturnType<typeof getReferralRewardProgress>;
  rewardEligible: boolean;
  rewardClaimed: boolean;
};

export function parseReferralSettings(json: unknown): ReferralSettingsData {
  const data = json as {
    link?: string;
    signupCount?: number;
    rewards?: ReturnType<typeof getReferralRewardProgress>;
    rewardEligible?: boolean;
    rewardClaimed?: boolean;
    branding?: { referralRewardClaimed?: boolean };
  };
  const signupCount = data.signupCount ?? 0;
  return {
    link: data.link ?? '',
    signupCount,
    rewards: data.rewards ?? getReferralRewardProgress(signupCount),
    rewardEligible: Boolean(data.rewardEligible),
    rewardClaimed: Boolean(data.rewardClaimed ?? data.branding?.referralRewardClaimed),
  };
}
