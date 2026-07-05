export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertWorkspaceRole } from '@/lib/workspace';
import { workspaceOwnerHasResellerPlan } from '@/lib/workspace-enterprise';
import { normalizePlanId } from '@/lib/plans';
import { requireUserId, isAuthError } from '@/lib/session-auth';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const { id } = await params;
  const client = await prisma.workspaceClient.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const access = await assertWorkspaceRole(userId, client.workspaceId, 'admin');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: client.workspaceId },
    select: { owner: { select: { plan: true } } },
  });
  if (!workspaceOwnerHasResellerPlan(workspace?.owner.plan)) {
    return NextResponse.json({ error: 'reseller_plan_required' }, { status: 403 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = String(body.name).trim().slice(0, 120);
  if (body.email !== undefined) data.email = String(body.email).trim().toLowerCase() || null;
  if (body.plan !== undefined) data.plan = normalizePlanId(String(body.plan));
  if (body.monthlyFeeUsd !== undefined) {
    data.monthlyFeeCents = Math.max(0, Math.round(parseFloat(String(body.monthlyFeeUsd)) * 100) || 0);
  }
  if (body.status !== undefined && ['active', 'paused', 'churned'].includes(String(body.status))) {
    data.status = String(body.status);
  }
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes).slice(0, 2000) : null;
  if (body.externalRef !== undefined) {
    data.externalRef = body.externalRef ? String(body.externalRef).slice(0, 120) : null;
  }

  const updated = await prisma.workspaceClient.update({ where: { id }, data });
  return NextResponse.json({ client: updated });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const { id } = await params;
  const client = await prisma.workspaceClient.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const access = await assertWorkspaceRole(userId, client.workspaceId, 'admin');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  await prisma.workspaceClient.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
