export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { adminListQuerySchema } from '@/lib/admin/schemas';

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const parsed = adminListQuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_query' }, { status: 400 });
  }
  const { q, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { slug: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.workspace.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        isPersonal: true,
        ssoEnabled: true,
        createdAt: true,
        owner: { select: { email: true, name: true, plan: true } },
        _count: { select: { members: true, clients: true, qrCodes: true } },
      },
    }),
    prisma.workspace.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((w) => ({
      id: w.id,
      name: w.name,
      slug: w.slug,
      isPersonal: w.isPersonal,
      ssoEnabled: w.ssoEnabled,
      ownerPlan: w.owner.plan,
      createdAt: w.createdAt,
      ownerEmail: w.owner.email,
      ownerName: w.owner.name,
      memberCount: w._count.members,
      clientCount: w._count.clients,
      qrCount: w._count.qrCodes,
    })),
    total,
    page,
    limit,
  });
}
