export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { canUserSellOnMarketplace } from '@/lib/marketplace-seller';
import { refreshConnectStatus } from '@/lib/marketplace-connect';
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from '@/lib/marketplace-types';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await refreshConnectStatus(userId).catch(() => undefined);

  const seller = await prisma.marketplaceSeller.findUnique({
    where: { userId },
    select: {
      id: true,
      displayName: true,
      bio: true,
      stripeConnectId: true,
      connectOnboardingDone: true,
      payoutsEnabled: true,
      createdAt: true,
      _count: { select: { listings: true } },
    },
  });

  const sellCheck = await canUserSellOnMarketplace(userId);

  return NextResponse.json({
    seller,
    sellCheck,
    platformFeePercent: MARKETPLACE_PLATFORM_FEE_PERCENT,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const name = session?.user?.name;
  const email = session?.user?.email;
  if (!userId || !email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sellCheck = await canUserSellOnMarketplace(userId);
  if (sellCheck.limit <= 0) {
    return NextResponse.json({ error: sellCheck.reason }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const displayName = String(body.displayName ?? name ?? email.split('@')[0]).trim().slice(0, 80);
  const bio = body.bio ? String(body.bio).trim().slice(0, 500) : null;

  const seller = await prisma.marketplaceSeller.upsert({
    where: { userId },
    create: { userId, displayName, bio },
    update: { displayName, bio },
    select: {
      id: true,
      displayName: true,
      bio: true,
      connectOnboardingDone: true,
      payoutsEnabled: true,
    },
  });

  return NextResponse.json({ seller });
}
