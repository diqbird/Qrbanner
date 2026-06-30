export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';
import { normalizePlanId, type PlanId } from '@/lib/plans';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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
  if (planFilter && ['free', 'pro', 'business'].includes(planFilter)) {
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
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, plan: true, role: true },
  });

  return NextResponse.json({ user: updated });
}
