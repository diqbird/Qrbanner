export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { canClaimReferralReward, REFERRAL_REWARD_PRO_DAYS } from '@/lib/referral-rewards';
import { referralClaimedBranding } from '@/lib/referral-checkout';
import { parseBrandingSettings } from '@/lib/referral';
import { normalizePlanId } from '@/lib/plans';
import { requireUserId, isAuthError } from '@/lib/session-auth';

/** Claim 5-referral Pro reward — complimentary timed Pro plan grant (no checkout). */
export async function POST() {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralSignupCount: true,
        plan: true,
        paddleSubscriptionId: true,
        brandingSettings: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const branding = parseBrandingSettings(user.brandingSettings);
    if (!canClaimReferralReward(user.referralSignupCount, Boolean(branding.referralRewardClaimed))) {
      return NextResponse.json({ error: 'Reward not available' }, { status: 403 });
    }

    if (user.paddleSubscriptionId) {
      return NextResponse.json({ error: 'paid_subscription_active' }, { status: 403 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFERRAL_REWARD_PRO_DAYS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: normalizePlanId(user.plan) === 'free' ? 'pro' : user.plan,
        planGrantExpiresAt: expiresAt,
        brandingSettings: referralClaimedBranding(user.brandingSettings),
      },
    });

    return NextResponse.json({
      ok: true,
      plan: normalizePlanId(user.plan) === 'free' ? 'pro' : user.plan,
      expiresAt: expiresAt.toISOString(),
      daysGranted: REFERRAL_REWARD_PRO_DAYS,
      redirect: '/settings?tab=plan&billing=referral_reward',
    });
  } catch (error) {
    console.error('[referral claim-reward]', error);
    return NextResponse.json({ error: 'Could not claim reward' }, { status: 500 });
  }
}
