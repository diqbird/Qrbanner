export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
