export interface PlanLimits {
  id: PlanId;
  name: string;
  priceMonthly: number | null;
  priceLabel: string;
  maxQrCodes: number;
  maxCustomDomains: number;
  maxBulkRows: number;
  maxWebhooks: number;
  maxStyleTemplates: number;
  apiAccess: boolean;
  /** Short-term burst limit: max API requests per minute (abuse/DDoS protection). */
  apiRateLimitPerMin: number;
  /** Monthly API request quota (resets on the 1st). */
  apiMonthlyQuota: number;
  analyticsRetentionDays: number | null;
  codesActiveAfterCancel: boolean;
  whiteLabel?: boolean;
  highlighted?: boolean;
}

export type PlanId = 'free' | 'pro' | 'business' | 'agency';
export type BillingInterval = 'monthly' | 'annual';

export const ANNUAL_DISCOUNT_PERCENT = 20;

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceLabel: '$0',
    maxQrCodes: 25,
    maxCustomDomains: 1,
    maxBulkRows: 100,
    maxWebhooks: 2,
    maxStyleTemplates: 3,
    apiAccess: true,
    apiRateLimitPerMin: 60,
    apiMonthlyQuota: 1_000,
    analyticsRetentionDays: 90,
    codesActiveAfterCancel: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 9.99,
    priceLabel: '$9.99',
    maxQrCodes: 200,
    maxCustomDomains: 5,
    maxBulkRows: 500,
    maxWebhooks: 10,
    maxStyleTemplates: 20,
    apiAccess: true,
    apiRateLimitPerMin: 120,
    apiMonthlyQuota: 10_000,
    analyticsRetentionDays: 365,
    codesActiveAfterCancel: true,
    highlighted: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    priceMonthly: 29.99,
    priceLabel: '$29.99',
    maxQrCodes: 2000,
    maxCustomDomains: 20,
    maxBulkRows: 2000,
    maxWebhooks: 50,
    maxStyleTemplates: 999,
    apiAccess: true,
    apiRateLimitPerMin: 300,
    apiMonthlyQuota: 100_000,
    analyticsRetentionDays: null,
    codesActiveAfterCancel: true,
    whiteLabel: true,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    priceMonthly: 79.99,
    priceLabel: '$79.99',
    maxQrCodes: 5000,
    maxCustomDomains: 50,
    maxBulkRows: 5000,
    maxWebhooks: 100,
    maxStyleTemplates: 999,
    apiAccess: true,
    apiRateLimitPerMin: 600,
    apiMonthlyQuota: 500_000,
    analyticsRetentionDays: null,
    codesActiveAfterCancel: true,
    whiteLabel: true,
  },
};

export function annualMonthlyEquivalent(monthlyPrice: number): number {
  const annualTotal = monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT_PERCENT / 100);
  return Math.round((annualTotal / 12) * 100) / 100;
}

export function annualTotalPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT_PERCENT / 100) * 100) / 100;
}

export function normalizePlanId(raw: string | null | undefined): PlanId {
  if (raw === 'pro' || raw === 'business' || raw === 'agency') return raw;
  return 'free';
}

export function getPlanLimits(planId: string | null | undefined): PlanLimits {
  return PLANS[normalizePlanId(planId)];
}

export const LAUNCH_BANNER =
  'Free plan forever. Upgrade to Pro from $9.99/mo when you need more. Your QR codes stay active if you downgrade or cancel.';
