export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isBillingConfigured } from '@/lib/billing-provider';
import { canClaimReferralReward } from '@/lib/referral-rewards';
import { referralClaimedBranding } from '@/lib/referral-checkout';
import { parseBrandingSettings } from '@/lib/referral';
import { requireUserId, isAuthError } from '@/lib/session-auth';

/** Claim 5-referral Pro reward — complimentary Pro plan grant via Paddle billing stack. */
export async function POST() {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    if (!isBillingConfigured()) {
      return NextResponse.json({ error: 'Billing is not configured' }, { status: 503 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralSignupCount: true,
        plan: true,
        brandingSettings: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const branding = parseBrandingSettings(user.brandingSettings);
    if (!canClaimReferralReward(user.referralSignupCount, Boolean(branding.referralRewardClaimed))) {
      return NextResponse.json({ error: 'Reward not available' }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: user.plan === 'free' ? 'pro' : user.plan,
        brandingSettings: referralClaimedBranding(user.brandingSettings),
      },
    });

    return NextResponse.json({
      ok: true,
      plan: user.plan === 'free' ? 'pro' : user.plan,
      redirect: '/settings?billing=referral_reward',
    });
  } catch (error) {
    console.error('[referral claim-reward]', error);
    return NextResponse.json({ error: 'Could not claim reward' }, { status: 500 });
  }
}
