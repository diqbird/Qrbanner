import { NextResponse } from 'next/server';
import { getPublicBillingStatus } from '@/lib/public-billing-status';

export const dynamic = 'force-dynamic';

/** Public billing readiness — used by pricing CTAs (no secrets). */
export async function GET() {
  return NextResponse.json(getPublicBillingStatus());
}