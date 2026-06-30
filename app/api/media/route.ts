export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = (session?.user as { role?: string })?.role === 'admin';

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
