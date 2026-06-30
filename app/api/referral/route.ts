export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { ensureReferralCode, parseBrandingSettings } from '@/lib/referral';
import { getReferralRewardProgress } from '@/lib/referral-rewards';
import { canClaimReferralReward } from '@/lib/referral-stripe';
import { siteBaseUrl } from '@/lib/stripe';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, referralSignupCount: true, plan: true, brandingSettings: true },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const code = user.referralCode ?? (await ensureReferralCode(userId));
    const base = siteBaseUrl();
    const branding = parseBrandingSettings(user.brandingSettings);
    const rewards = getReferralRewardProgress(user.referralSignupCount);
    const rewardClaimed = Boolean(branding.referralRewardClaimed);
    const rewardEligible = canClaimReferralReward(user.referralSignupCount, rewardClaimed);

    return NextResponse.json({
      code,
      signupCount: user.referralSignupCount,
      link: `${base}/signup?ref=${code}`,
      plan: user.plan,
      branding,
      rewards,
      rewardClaimed,
      rewardEligible,
    });
  } catch (error) {
    console.error('[referral GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, brandingSettings: true },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const current = parseBrandingSettings(user.brandingSettings);
    const next = {
      ...current,
      ...(body.hidePoweredBy !== undefined ? { hidePoweredBy: Boolean(body.hidePoweredBy) } : {}),
      ...(body.agencyName !== undefined ? { agencyName: String(body.agencyName).trim() || undefined } : {}),
      ...(body.supportEmail !== undefined ? { supportEmail: String(body.supportEmail).trim() || undefined } : {}),
    };

    if (next.hidePoweredBy && user.plan !== 'agency' && user.plan !== 'business') {
      return NextResponse.json(
        { error: 'White-label branding requires Business or Agency plan' },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { brandingSettings: next },
    });

    return NextResponse.json({ branding: next });
  } catch (error) {
    console.error('[referral PATCH branding]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
