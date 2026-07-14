export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';
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
import { sendTeamInviteEmail } from '@/lib/email';
import { resolveOutboundEmailLocaleFromRequest } from '@/lib/i18n/resolve-outbound-email-locale';
import { requireMfaStepUp } from '@/lib/mfa-recovery';

function extractMfaCode(body: Record<string, unknown>): string {
  if (typeof body.mfaCode === 'string') return body.mfaCode;
  if (typeof body.mfa_code === 'string') return body.mfa_code;
  if (typeof body.code === 'string') return body.code;
  return '';
}

export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

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
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const body = await req.json();
  const workspaceId = String(body.workspaceId ?? (await getActiveWorkspaceId(userId)));
  const action = body.action as string;

  if (action === 'invite') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const mfa = await requireMfaStepUp(userId, extractMfaCode(body));
    if (!mfa.ok) return NextResponse.json({ error: mfa.error }, { status: mfa.status });

    const email = String(body.email ?? '').trim().toLowerCase();
    const role = String(body.role ?? 'editor');
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true, ssoEnabled: true, allowedDomains: true },
    });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const inviteCheck = assertInviteEmailAllowed(workspace, email);
    if (!inviteCheck.ok) {
      return NextResponse.json({ error: inviteCheck.code }, { status: 400 });
    }

    const inviter = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, brandingSettings: true },
    });

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
    const locale = resolveOutboundEmailLocaleFromRequest(req, inviter?.brandingSettings, body.locale);
    const inviterName = inviter?.name?.trim() || inviter?.email || 'QRbanner';

    try {
      await sendTeamInviteEmail(
        email,
        {
          workspaceName: workspace.name,
          inviterName,
          role,
          inviteUrl,
        },
        locale,
        workspaceId,
      );
    } catch (err) {
      console.error('[workspace/members] invite email failed:', err);
    }

    const { recordWorkspaceAudit } = await import('@/lib/workspace-audit');
    await recordWorkspaceAudit({
      workspaceId,
      actorUserId: userId,
      action: 'member.invite',
      meta: { email, role, memberId: member.id },
    });

    return NextResponse.json({ member, inviteUrl });
  }

  if (action === 'remove') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const mfa = await requireMfaStepUp(userId, extractMfaCode(body));
    if (!mfa.ok) return NextResponse.json({ error: mfa.error }, { status: mfa.status });

    const memberId = String(body.memberId ?? '');
    const target = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });
    if (!target) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (target.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove workspace owner' }, { status: 400 });
    }
    await prisma.workspaceMember.delete({ where: { id: memberId } });

    const { recordWorkspaceAudit } = await import('@/lib/workspace-audit');
    await recordWorkspaceAudit({
      workspaceId,
      actorUserId: userId,
      action: 'member.remove',
      meta: { email: target.email, role: target.role, memberId },
    });

    return NextResponse.json({ ok: true });
  }

  if (action === 'update_role') {
    const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

    const mfa = await requireMfaStepUp(userId, extractMfaCode(body));
    if (!mfa.ok) return NextResponse.json({ error: mfa.error }, { status: mfa.status });

    const memberId = String(body.memberId ?? '');
    const role = String(body.role ?? '');
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const target = await prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    });
    if (!target) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (target.role === 'owner') {
      return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
    }

    const previousRole = target.role;
    const member = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
    });

    const { recordWorkspaceAudit } = await import('@/lib/workspace-audit');
    await recordWorkspaceAudit({
      workspaceId,
      actorUserId: userId,
      action: 'member.update_role',
      meta: { email: target.email, memberId, previousRole, role },
    });

    return NextResponse.json({ member });
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

    const { recordWorkspaceAudit } = await import('@/lib/workspace-audit');
    await recordWorkspaceAudit({
      workspaceId,
      actorUserId: userId,
      action: 'sso.update',
      meta: {
        ssoEnabled: Boolean(body.ssoEnabled),
        ssoProvider,
      },
    });

    return NextResponse.json({ workspace: updated });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
