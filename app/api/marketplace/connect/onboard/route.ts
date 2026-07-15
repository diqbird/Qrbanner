export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createConnectOnboardingLink } from '@/lib/marketplace-connect';
import { canUserSellOnMarketplace } from '@/lib/marketplace-seller';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

export async function POST() {
  const auth = await requireSessionContext();
  if (isAuthError(auth)) return auth;
  const { userId, email } = auth;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sellCheck = await canUserSellOnMarketplace(userId);
  if (sellCheck.limit <= 0) {
    return NextResponse.json({ error: sellCheck.reason }, { status: 403 });
  }

  const result = await createConnectOnboardingLink(userId, email);
  if ('fallback' in result) {
    return NextResponse.json({ fallback: result.fallback });
  }
  return NextResponse.json({ ready: true });
}
