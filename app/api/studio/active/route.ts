export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getActiveStudioEntitlementForUser } from '@/lib/studio-entitlement';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;

  const entitlement = await getActiveStudioEntitlementForUser(auth);
  return NextResponse.json({ entitlement });
}
