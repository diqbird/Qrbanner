export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { mobileScanUrl, serializeMobileQr } from '@/lib/mobile-serialize';

export async function GET(req: NextRequest) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '30', 10) || 30, 100);
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase();

  const where = { userId: auth.userId };
  const items = await prisma.qRCode.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
    include: { folder: { select: { name: true } } },
  });

  const filtered = q
    ? items.filter(
        (qr) =>
          qr.name.toLowerCase().includes(q) ||
          qr.shortCode.toLowerCase().includes(q)
      )
    : items;

  const scanBase = await mobileScanUrl(auth.userId, filtered[0]?.shortCode ?? 'x');
  const basePrefix = scanBase.replace(/\/s\/[^/]+$/, '');

  const data = filtered.map((qr) =>
    serializeMobileQr(qr, `${basePrefix}/s/${qr.shortCode}`)
  );

  const total = await prisma.qRCode.count({ where });

  return NextResponse.json(
    {
      data,
      pagination: { total, limit, offset, count: data.length },
    },
    { headers: auth.rateLimitHeaders }
  );
}
