export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertWorkspaceRole, getActiveWorkspaceId } from '@/lib/workspace';
import { encryptSecret } from '@/lib/secret-crypto';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  ENTERPRISE_SMTP_SCOPE,
  workspaceOwnerHasEnterprisePlan,
  workspaceOwnerHasResellerPlan,
} from '@/lib/workspace-enterprise';
import { generateScimBearerToken } from '@/lib/scim';
import { testWorkspaceSmtp } from '@/lib/tenant-email';

const enterpriseSelect = {
  id: true,
  name: true,
  slug: true,
  isPersonal: true,
  smtpEnabled: true,
  smtpHost: true,
  smtpPort: true,
  smtpUser: true,
  smtpFrom: true,
  scimEnabled: true,
  scimTokenPrefix: true,
  resellerEnabled: true,
} as const;

export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const workspaceId =
    req.nextUrl.searchParams.get('workspaceId') ?? (await getActiveWorkspaceId(userId));
  const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      ...enterpriseSelect,
      owner: { select: { plan: true } },
    },
  });
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

  const baseUrl = (process.env.NEXTAUTH_URL ?? 'https://qrbanner.com').replace(/\/$/, '');
  return NextResponse.json({
    workspace,
    features: {
      enterprise: workspaceOwnerHasEnterprisePlan(workspace.owner.plan),
      reseller: workspaceOwnerHasResellerPlan(workspace.owner.plan),
    },
    scimBaseUrl: `${baseUrl}/api/scim/v2`,
    smtpConfigured: Boolean(workspace.smtpHost && workspace.smtpUser),
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const body = await req.json();
  const workspaceId = String(body.workspaceId ?? (await getActiveWorkspaceId(userId)));
  const action = String(body.action ?? '');

  const access = await assertWorkspaceRole(userId, workspaceId, 'owner');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { owner: { select: { plan: true } } },
  });
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  if (workspace.isPersonal) {
    return NextResponse.json({ error: 'enterprise_team_only' }, { status: 400 });
  }

  if (action === 'update_smtp') {
    if (!workspaceOwnerHasEnterprisePlan(workspace.owner.plan)) {
      return NextResponse.json({ error: 'enterprise_plan_required' }, { status: 403 });
    }

    const smtpHost = body.smtpHost !== undefined ? String(body.smtpHost ?? '').trim() || null : workspace.smtpHost;
    const smtpPort =
      body.smtpPort !== undefined
        ? parseInt(String(body.smtpPort), 10) || null
        : workspace.smtpPort;
    const smtpUser = body.smtpUser !== undefined ? String(body.smtpUser ?? '').trim() || null : workspace.smtpUser;
    const smtpFrom = body.smtpFrom !== undefined ? String(body.smtpFrom ?? '').trim() || null : workspace.smtpFrom;
    const smtpEnabled = body.smtpEnabled !== undefined ? Boolean(body.smtpEnabled) : workspace.smtpEnabled;

    let smtpPasswordEnc = workspace.smtpPasswordEnc;
    if (body.smtpPassword !== undefined && String(body.smtpPassword).trim()) {
      smtpPasswordEnc = encryptSecret(String(body.smtpPassword).trim(), ENTERPRISE_SMTP_SCOPE);
    }

    if (smtpEnabled && (!smtpHost || !smtpUser || !smtpPasswordEnc)) {
      return NextResponse.json({ error: 'smtp_incomplete' }, { status: 400 });
    }

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: { smtpEnabled, smtpHost, smtpPort, smtpUser, smtpFrom, smtpPasswordEnc },
      select: enterpriseSelect,
    });
    return NextResponse.json({ workspace: updated });
  }

  if (action === 'test_smtp') {
    if (!workspaceOwnerHasEnterprisePlan(workspace.owner.plan)) {
      return NextResponse.json({ error: 'enterprise_plan_required' }, { status: 403 });
    }
    const to = String(body.testEmail ?? '').trim();
    if (!to) return NextResponse.json({ error: 'email_required' }, { status: 400 });
    const result = await testWorkspaceSmtp(workspaceId, to);
    if (!result.sent) return NextResponse.json({ error: 'smtp_test_failed' }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'update_scim') {
    if (!workspaceOwnerHasEnterprisePlan(workspace.owner.plan)) {
      return NextResponse.json({ error: 'enterprise_plan_required' }, { status: 403 });
    }

    const scimEnabled = body.scimEnabled !== undefined ? Boolean(body.scimEnabled) : workspace.scimEnabled;
    let scimToken: string | undefined;
    let data: Record<string, unknown> = { scimEnabled };

    if (body.regenerateToken) {
      const generated = generateScimBearerToken();
      data = {
        ...data,
        scimTokenHash: generated.hash,
        scimTokenPrefix: generated.prefix,
      };
      scimToken = generated.token;
    } else if (scimEnabled && !workspace.scimTokenHash) {
      const generated = generateScimBearerToken();
      data = {
        ...data,
        scimTokenHash: generated.hash,
        scimTokenPrefix: generated.prefix,
      };
      scimToken = generated.token;
    }

    if (!scimEnabled) {
      data = { scimEnabled: false };
    }

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data,
      select: enterpriseSelect,
    });
    return NextResponse.json({ workspace: updated, scimToken });
  }

  if (action === 'update_reseller') {
    if (!workspaceOwnerHasResellerPlan(workspace.owner.plan)) {
      return NextResponse.json({ error: 'reseller_plan_required' }, { status: 403 });
    }
    const resellerEnabled =
      body.resellerEnabled !== undefined ? Boolean(body.resellerEnabled) : workspace.resellerEnabled;
    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: { resellerEnabled },
      select: enterpriseSelect,
    });
    return NextResponse.json({ workspace: updated });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
