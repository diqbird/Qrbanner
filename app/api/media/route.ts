export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

export async function GET() {
  try {
    const auth = await requireSessionContext();
    if (isAuthError(auth)) return auth;
    const { userId, role } = auth;

    const isAdmin = role === 'admin';

    const assets = await prisma.mediaAsset.findMany({
      where: isAdmin ? {} : { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        filename: true,
        url: true,
        mimeType: true,
        sizeBytes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ assets });
  } catch {
    return NextResponse.json({ assets: [] });
  }
}
