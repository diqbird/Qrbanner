export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertInviteAcceptAllowed } from '@/lib/workspace-sso';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError, requireSessionContext } from '@/lib/session-auth';
import {
  AUTH_INVITE_ACCEPT_IP,
  AUTH_INVITE_ACCEPT_USER,
  AUTH_INVITE_LOOKUP_IP,
} from '@/lib/rate-limit-policies';
import { clientIp } from '@/lib/rate-limit-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const ip = clientIp(req);
  const limited = await enforceRateLimit(
    AUTH_INVITE_LOOKUP_IP.key(ip),
    AUTH_INVITE_LOOKUP_IP.limit,
    AUTH_INVITE_LOOKUP_IP.windowMs
  );
  if (limited) return limited;

  const member = await prisma.workspaceMember.findFirst({
    where: { inviteToken: params.token, status: 'pending' },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          owner: { select: { plan: true, brandingSettings: true } },
        },
      },
    },
  });
  if (!member) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });

  const { canUseWhiteLabel, parseBrandingSettings } = await import('@/lib/referral');
  const owner = member.workspace.owner;
  const branding = parseBrandingSettings(owner?.brandingSettings);
  const whiteLabel = owner ? canUseWhiteLabel(owner.plan) : false;
  const agencyName = branding.agencyName?.trim();

  return NextResponse.json({
    email: member.email,
    role: member.role,
    workspace: { id: member.workspace.id, name: member.workspace.name },
    branding: whiteLabel
      ? {
          agencyName: agencyName || null,
          logoUrl: branding.logoUrl || null,
          brandColor: branding.brandColor || null,
        }
      : null,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const auth = await requireSessionContext();
  if (isAuthError(auth)) return auth;
  if (auth.mfaVerified === false) {
    return NextResponse.json({ error: 'mfa_required' }, { status: 403 });
  }
  const userId = auth.userId;


  const ip = clientIp(req);
  const ipLimited = await enforceRateLimit(
    AUTH_INVITE_ACCEPT_IP.key(ip),
    AUTH_INVITE_ACCEPT_IP.limit,
    AUTH_INVITE_ACCEPT_IP.windowMs
  );
  if (ipLimited) return ipLimited;

  const userLimited = await enforceRateLimit(
    AUTH_INVITE_ACCEPT_USER.key(userId),
    AUTH_INVITE_ACCEPT_USER.limit,
    AUTH_INVITE_ACCEPT_USER.windowMs
  );
  if (userLimited) return userLimited;

  const member = await prisma.workspaceMember.findFirst({
    where: { inviteToken: params.token, status: 'pending' },
    include: {
      workspace: {
        select: { ssoEnabled: true, ssoProvider: true, allowedDomains: true },
      },
    },
  });
  if (!member) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.toLowerCase() !== member.email.toLowerCase()) {
    return NextResponse.json({ error: 'Invite email does not match your account' }, { status: 403 });
  }

  const acceptCheck = await assertInviteAcceptAllowed(
    userId,
    user.email,
    member.workspace
  );
  if (!acceptCheck.ok) {
    return NextResponse.json({ error: acceptCheck.code }, { status: 403 });
  }

  await prisma.workspaceMember.update({
    where: { id: member.id },
    data: {
      userId,
      status: 'active',
      joinedAt: new Date(),
      inviteToken: null,
    },
  });

  return NextResponse.json({ ok: true, workspaceId: member.workspaceId });
}
