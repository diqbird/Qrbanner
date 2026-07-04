import { NextResponse } from 'next/server';
import { activeBillingProvider, isAnnualBillingConfigured, isBillingConfigured } from '@/lib/billing-provider';
import { paddleClientToken, paddleEnvironment } from '@/lib/paddle';

export const dynamic = 'force-dynamic';

/** Public billing readiness — used by pricing CTAs (no secrets). */
export async function GET() {
  const provider = activeBillingProvider();
  const paddle =
    provider === 'paddle'
      ? {
          clientToken: paddleClientToken(),
          environment: paddleEnvironment(),
        }
      : null;

  return NextResponse.json({
    configured: isBillingConfigured(),
    annualAvailable: isAnnualBillingConfigured(),
    provider,
    paddle,
  });
}