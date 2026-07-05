export const REFERRAL_MILESTONES = [1, 3, 5, 10] as const;

export type ReferralMilestone = (typeof REFERRAL_MILESTONES)[number];

export interface ReferralRewardProgress {
  signupCount: number;
  currentMilestone: ReferralMilestone | 0;
  nextMilestone: ReferralMilestone | null;
  progressPercent: number;
}

export const REFERRAL_REWARD_MIN_SIGNUPS = 5;

export function getReferralRewardProgress(signupCount: number): ReferralRewardProgress {
  const count = Math.max(0, signupCount);
  const currentMilestone =
    ([...REFERRAL_MILESTONES].reverse().find((m) => count >= m) as ReferralMilestone | undefined) ?? 0;
  const nextMilestone = REFERRAL_MILESTONES.find((m) => m > count) ?? null;
  const progressPercent = nextMilestone ? Math.min(100, Math.round((count / nextMilestone) * 100)) : 100;

  return { signupCount: count, currentMilestone, nextMilestone, progressPercent };
}

export function canClaimReferralReward(signupCount: number, claimed: boolean): boolean {
  return signupCount >= REFERRAL_REWARD_MIN_SIGNUPS && !claimed;
}
