export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, password: true },
  });
  if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });

  return NextResponse.json({
    enabled: user.totpEnabled,
    hasPassword: Boolean(user.password),
    pendingSetup: false,
  });
}
