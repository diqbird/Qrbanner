export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const { name } = await req.json();

    await prisma.user.update({
      where: { id: userId },
      data: { name: name ?? null },
    });

    return NextResponse.json({ message: 'Profile updated' });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
