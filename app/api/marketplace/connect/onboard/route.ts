export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createConnectOnboardingLink } from '@/lib/marketplace-connect';
import { canUserSellOnMarketplace } from '@/lib/marketplace-seller';

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const email = session?.user?.email;
  if (!userId || !email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sellCheck = await canUserSellOnMarketplace(userId);
  if (sellCheck.limit <= 0) {
    return NextResponse.json({ error: sellCheck.reason }, { status: 403 });
  }

  const result = await createConnectOnboardingLink(userId, email);
  if ('fallback' in result) {
    return NextResponse.json({ fallback: result.fallback });
  }
  return NextResponse.json({ url: result.url });
}
