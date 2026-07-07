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
          { shortCode: { contains: q, mode: 'insensitive' as const } },
          { user: { email: { contains: q, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.qRCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        shortCode: true,
        category: true,
        isActive: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
        _count: { select: { scans: true } },
      },
    }),
    prisma.qRCode.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map((qr) => ({
      id: qr.id,
      name: qr.name,
      shortCode: qr.shortCode,
      category: qr.category,
      isActive: qr.isActive,
      createdAt: qr.createdAt,
      ownerEmail: qr.user.email,
      ownerName: qr.user.name,
      scanCount: qr._count.scans,
    })),
    total,
    page,
    limit,
  });
}
