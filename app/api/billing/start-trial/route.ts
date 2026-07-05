export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isBillingConfigured } from '@/lib/billing-provider';
import { startProTrial } from '@/lib/pro-trial';
import { requireUserId, isAuthError } from '@/lib/session-auth';

/** Start the one-time 14-day Pro trial (no card required). */
export async function POST() {
  try {
    if (!isBillingConfigured()) {
      return NextResponse.json({ error: 'billing_not_configured' }, { status: 503 });
    }

    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;

    const result = await startProTrial(auth);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      plan: 'pro',
      expiresAt: result.expiresAt,
      daysLeft: result.daysLeft,
      redirect: '/dashboard?trial=started',
    });
  } catch (error) {
    console.error('[billing/start-trial]', error);
    return NextResponse.json({ error: 'Could not start trial' }, { status: 500 });
  }
}
