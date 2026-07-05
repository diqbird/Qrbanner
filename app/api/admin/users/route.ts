export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { normalizePlanId, type PlanId } from '@/lib/plans';
import { billingStatusForUser } from '@/lib/admin-billing-stats';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const planFilter = req.nextUrl.searchParams.get('plan');

  const where: {
    OR?: { email?: { contains: string; mode: 'insensitive' }; name?: { contains: string; mode: 'insensitive' } }[];
    plan?: string;
  } = {};

  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (planFilter && ['free', 'pro', 'business', 'agency'].includes(planFilter)) {
    where.plan = planFilter;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      paddleSubscriptionId: true,
      _count: { select: { qrCodes: true } },
    },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      plan: u.plan,
      role: u.role,
      createdAt: u.createdAt,
      emailVerified: !!u.emailVerified,
      qrCount: u._count.qrCodes,
      billingStatus: billingStatusForUser(u.plan, u.paddleSubscriptionId),
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const body = await req.json();
  const userId = body?.userId as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  if (userId === adminId && body?.role && body.role !== 'admin') {
    return NextResponse.json({ error: 'You cannot remove your own admin role' }, { status: 400 });
  }

  const data: { plan?: PlanId; role?: string } = {};
  if (body?.plan !== undefined) {
    data.plan = normalizePlanId(body.plan);
  }
  if (body?.role !== undefined) {
    if (!['user', 'admin'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    data.role = body.role;
  }

  if (!data.plan && !data.role) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, plan: true, role: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, plan: true, role: true },
  });

  const actor = await getAdminActorContext(adminId, req);
  if (data.plan) {
    await recordAdminAudit({
      ...actor,
      action: 'user.plan_update',
      targetType: 'user',
      targetId: userId,
      summary: `${existing.email}: ${existing.plan} → ${updated.plan}`,
      metadata: { from: existing.plan, to: updated.plan, email: existing.email },
    });
  }
  if (data.role) {
    await recordAdminAudit({
      ...actor,
      action: 'user.role_update',
      targetType: 'user',
      targetId: userId,
      summary: `${existing.email}: ${existing.role} → ${updated.role}`,
      metadata: { from: existing.role, to: updated.role, email: existing.email },
    });
  }

  return NextResponse.json({ user: updated });
}
