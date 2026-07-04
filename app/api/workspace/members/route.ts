export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import {
  assertWorkspaceRole,
  generateInviteToken,
  getActiveWorkspaceId,
  workspaceSummaryForRole,
} from '@/lib/workspace';
import {
  assertInviteEmailAllowed,
  normalizeAllowedDomainsInput,
  parseAllowedDomains,
  workspaceOwnerHasSsoPlan,
} from '@/lib/workspace-sso';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const workspaceId =
    req.nextUrl.searchParams.get('workspaceId') ?? (await getActiveWorkspaceId(userId));
  const access = await assertWorkspaceRole(userId, workspaceId, 'viewer');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    orderBy: { invitedAt: 'asc' },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      invitedAt: true,
      joinedAt: true,
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      slug: true,
      isPersonal: true,
      ssoEnabled: true,
      ssoProvider: true,
      allowedDomains: true,
      idpEntityId: true,
      idpSsoUrl: true,
      idpCertificate: true,
    },
  });

  return NextResponse.json({
    workspace: workspace ? workspaceSummaryForRole(workspace, access.role) : null,
    members,
    role: access.role,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const workspaceId = String(body.workspaceId ?? (await getActiveWorkspaceId(userId)));
  const action = body.action as string;

  if (action === 'invite') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const email = String(body.email ?? '').trim().toLowerCase();
    const role = String(body.role ?? 'editor');
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { ssoEnabled: true, allowedDomains: true },
    });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const inviteCheck = assertInviteEmailAllowed(workspace, email);
    if (!inviteCheck.ok) {
      return NextResponse.json({ error: inviteCheck.code }, { status: 400 });
    }

    const token = generateInviteToken();
    const member = await prisma.workspaceMember.upsert({
      where: { workspaceId_email: { workspaceId, email } },
      create: {
        workspaceId,
        email,
        role,
        status: 'pending',
        inviteToken: token,
      },
      update: { role, status: 'pending', inviteToken: token },
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL ?? 'https://qrbanner.com'}/invite/${token}`;
    return NextResponse.json({ member, inviteUrl });
  }

  if (action === 'remove') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const memberId = String(body.memberId ?? '');
    const target = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });
    if (!target) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (target.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove workspace owner' }, { status: 400 });
    }
    await prisma.workspaceMember.delete({ where: { id: memberId } });
    return NextResponse.json({ ok: true });
  }

  if (action === 'update_sso') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'owner');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { owner: { select: { plan: true } } },
    });
    if (workspace?.isPersonal) {
      return NextResponse.json({ error: 'SSO is for team workspaces only' }, { status: 400 });
    }

    if (Boolean(body.ssoEnabled) && !workspaceOwnerHasSsoPlan(workspace?.owner.plan)) {
      return NextResponse.json({ error: 'sso_plan_required' }, { status: 403 });
    }

    const allowedDomains =
      body.allowedDomains !== undefined
        ? normalizeAllowedDomainsInput(body.allowedDomains).slice(0, 20)
        : parseAllowedDomains(workspace?.allowedDomains);

    const ssoProvider = body.ssoProvider ? String(body.ssoProvider) : null;
    const idpEntityId =
      body.idpEntityId !== undefined ? String(body.idpEntityId ?? '').trim() || null : workspace?.idpEntityId ?? null;
    const idpSsoUrl =
      body.idpSsoUrl !== undefined ? String(body.idpSsoUrl ?? '').trim() || null : workspace?.idpSsoUrl ?? null;
    const idpCertificate =
      body.idpCertificate !== undefined
        ? String(body.idpCertificate ?? '').trim() || null
        : workspace?.idpCertificate ?? null;

    if (Boolean(body.ssoEnabled) && ssoProvider === 'saml') {
      if (!idpSsoUrl || !idpCertificate) {
        return NextResponse.json({ error: 'saml_idp_incomplete' }, { status: 400 });
      }
    }

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ssoEnabled: Boolean(body.ssoEnabled),
        ssoProvider,
        allowedDomains,
        idpEntityId,
        idpSsoUrl,
        idpCertificate,
      },
    });
    return NextResponse.json({ workspace: updated });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
