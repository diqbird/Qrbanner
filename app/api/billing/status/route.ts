import { NextResponse } from 'next/server';
import { activeBillingProvider, isBillingConfigured } from '@/lib/billing-provider';

export const dynamic = 'force-dynamic';

/** Public billing readiness — used by pricing CTAs (no secrets). */
export async function GET() {
  const provider = activeBillingProvider();
  return NextResponse.json({
    configured: isBillingConfigured(),
    provider,
  });
}
