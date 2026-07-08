export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { adminListQuerySchema } from '@/lib/admin/schemas';

const MENU_CATEGORIES = ['menu', 'restaurant'];

export async function GET(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const parsed = adminListQuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_query' }, { status: 400 });
  }
  const { q, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const where = {
    category: { in: MENU_CATEGORIES },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { shortCode: { contains: q, mode: 'insensitive' as const } },
            { user: { email: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  };

  const [items, total, landingCount] = await Promise.all([
    prisma.qRCode.findMany({
      where,
      orderBy: { totalScans: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        shortCode: true,
        category: true,
        targetUrl: true,
        isActive: true,
        totalScans: true,
        landingPageEnabled: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.qRCode.count({ where }),
    prisma.qRCode.count({ where: { ...where, landingPageEnabled: true } }),
  ]);

  return NextResponse.json({
    items: items.map((qr) => ({
      id: qr.id,
      name: qr.name,
      shortCode: qr.shortCode,
      category: qr.category,
      targetUrl: qr.targetUrl,
      isActive: qr.isActive,
      totalScans: qr.totalScans,
      landingPageEnabled: qr.landingPageEnabled,
      createdAt: qr.createdAt,
      ownerEmail: qr.user.email,
    })),
    total,
    landingCount,
    page,
    limit,
  });
}
