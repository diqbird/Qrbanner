export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  canUseWhiteLabel,
  ensureReferralCode,
  normalizeBrandColor,
  normalizeLogoUrl,
  parseBrandingSettings,
} from '@/lib/referral';
import { canClaimReferralReward, getReferralRewardProgress } from '@/lib/referral-rewards';
import { siteBaseUrl } from '@/lib/billing-provider';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET() {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

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
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

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
      ...(body.logoUrl !== undefined ? { logoUrl: normalizeLogoUrl(body.logoUrl) } : {}),
      ...(body.brandColor !== undefined ? { brandColor: normalizeBrandColor(body.brandColor) } : {}),
    };

    const wantsWhiteLabelChrome =
      Boolean(next.hidePoweredBy) || Boolean(next.logoUrl) || Boolean(next.brandColor);
    if (wantsWhiteLabelChrome && !canUseWhiteLabel(user.plan)) {
      return NextResponse.json(
        { error: 'White-label branding requires Business or Agency plan' },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { brandingSettings: next },
    });

    const { getActiveWorkspaceId } = await import('@/lib/workspace');
    const { recordWorkspaceAudit } = await import('@/lib/workspace-audit');
    const workspaceId = await getActiveWorkspaceId(userId);
    if (workspaceId) {
      await recordWorkspaceAudit({
        workspaceId,
        actorUserId: userId,
        action: 'branding.update',
        meta: {
          hidePoweredBy: next.hidePoweredBy,
          agencyName: next.agencyName ?? null,
          logoUrl: next.logoUrl ?? null,
          brandColor: next.brandColor ?? null,
        },
      });
    }

    return NextResponse.json({ branding: next });
  } catch (error) {
    console.error('[referral PATCH branding]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
