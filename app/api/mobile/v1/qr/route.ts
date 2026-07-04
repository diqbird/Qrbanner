export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import { authenticateMobileRequest, isMobileAuthError } from '@/lib/mobile-auth';
import { mobileScanUrl, serializeMobileQr } from '@/lib/mobile-serialize';
import { resolveApiWorkspaceId } from '@/lib/workspace';

export async function GET(req: NextRequest) {
  const auth = await authenticateMobileRequest(req);
  if (isMobileAuthError(auth)) return auth;

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '30', 10) || 30, 100);
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;
  const q = req.nextUrl.searchParams.get('q')?.trim();
  const workspaceParam = req.nextUrl.searchParams.get('workspace_id') ?? req.nextUrl.searchParams.get('workspaceId');

  const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'viewer');
  if (!ws.ok) {
    return NextResponse.json({ error: ws.error }, { status: 403, headers: auth.rateLimitHeaders });
  }

  const where: Prisma.QRCodeWhereInput = { workspaceId: ws.workspaceId };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { shortCode: { contains: q, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.qRCode.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip: offset,
    include: { folder: { select: { name: true } } },
  });

  const scanBase = await mobileScanUrl(auth.userId, items[0]?.shortCode ?? 'x');
  const basePrefix = scanBase.replace(/\/s\/[^/]+$/, '');

  const data = items.map((qr) =>
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
