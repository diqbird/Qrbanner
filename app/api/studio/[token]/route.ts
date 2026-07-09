export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getStudioEntitlementByToken } from '@/lib/studio-entitlement';
import { getSessionUserId } from '@/lib/session-auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } },
) {
  const token = params.token?.trim();
  if (!token) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const userId = await getSessionUserId();
  const entitlement = await getStudioEntitlementByToken(token, userId);
  if (!entitlement) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 404 });
  }

  return NextResponse.json({ entitlement });
}
