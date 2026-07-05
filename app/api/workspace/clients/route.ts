export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertWorkspaceRole, getActiveWorkspaceId } from '@/lib/workspace';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  getResellerClientLimit,
  workspaceOwnerHasResellerPlan,
} from '@/lib/workspace-enterprise';
import { normalizePlanId } from '@/lib/plans';

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
    select: { resellerEnabled: true, owner: { select: { plan: true } } },
  });
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

  const clients = await prisma.workspaceClient.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const limit = getResellerClientLimit(workspace.owner.plan);
  return NextResponse.json({
    clients,
    resellerEnabled: workspace.resellerEnabled,
    limit,
    count: clients.length,
    allowed: workspaceOwnerHasResellerPlan(workspace.owner.plan),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const body = await req.json();
  const workspaceId = String(body.workspaceId ?? (await getActiveWorkspaceId(userId)));
  const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { resellerEnabled: true, owner: { select: { plan: true } }, isPersonal: true },
  });
  if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  if (!workspaceOwnerHasResellerPlan(workspace.owner.plan)) {
    return NextResponse.json({ error: 'reseller_plan_required' }, { status: 403 });
  }
  if (!workspace.resellerEnabled) {
    return NextResponse.json({ error: 'reseller_not_enabled' }, { status: 400 });
  }

  const limit = getResellerClientLimit(workspace.owner.plan);
  const count = await prisma.workspaceClient.count({ where: { workspaceId } });
  if (count >= limit) {
    return NextResponse.json({ error: 'reseller_client_limit' }, { status: 403 });
  }

  const name = String(body.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });

  const client = await prisma.workspaceClient.create({
    data: {
      workspaceId,
      name,
      email: body.email ? String(body.email).trim().toLowerCase() || null : null,
      plan: normalizePlanId(body.plan ? String(body.plan) : 'free'),
      monthlyFeeCents: Math.max(0, Math.round(parseFloat(String(body.monthlyFeeUsd ?? '0')) * 100) || 0),
      status: ['active', 'paused', 'churned'].includes(String(body.status)) ? String(body.status) : 'active',
      notes: body.notes ? String(body.notes).slice(0, 2000) : null,
      externalRef: body.externalRef ? String(body.externalRef).slice(0, 120) : null,
    },
  });

  return NextResponse.json({ client });
}
