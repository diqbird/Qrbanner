export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { assertInviteAcceptAllowed } from '@/lib/workspace-sso';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
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
    include: { workspace: { select: { id: true, name: true } } },
  });
  if (!member) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  return NextResponse.json({
    email: member.email,
    role: member.role,
    workspace: member.workspace,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const mfaVerified = (session as { mfaVerified?: boolean }).mfaVerified;
  if (mfaVerified === false) {
    return NextResponse.json({ error: 'mfa_required' }, { status: 403 });
  }

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
