import { activeBillingProvider, isAnnualBillingConfigured, isBillingConfigured } from '@/lib/billing-provider';
import { paddleClientToken, paddleEnvironment } from '@/lib/paddle';

export type PublicBillingStatus = {
  configured: boolean;
  annualAvailable: boolean;
  provider: 'paddle' | 'stripe' | null;
  paddle: {
    clientToken: string | null;
    environment: 'sandbox' | 'production';
  } | null;
};

/** Shared by /api/billing/status and SSR pricing (hydration-safe). */
export function getPublicBillingStatus(): PublicBillingStatus {
  const provider = activeBillingProvider();
  return {
    configured: isBillingConfigured(),
    annualAvailable: isAnnualBillingConfigured(),
    provider,
    paddle:
      provider === 'paddle'
        ? {
            clientToken: paddleClientToken(),
            environment: paddleEnvironment(),
          }
        : null,
  };
}
