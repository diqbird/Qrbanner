import { isBillingConfigured } from '@/lib/billing-provider';
import { isEtsyWebhookConfigured } from '@/lib/etsy-webhook';
import { MARKETPLACE_PAID_SALES_ENABLED } from '@/lib/marketplace-types';
import { isMarketplacePayoutConfigured } from '@/lib/marketplace-connect';
import { isPaddleFullyConfigured } from '@/lib/paddle';
import { isSmtpConfigured } from '@/lib/smtp-transport';

export type PublicHealthResponse = {
  ok: boolean;
  status: 'operational' | 'degraded';
  timestamp: string;
  responseMs: number;
};

export type DetailedHealthResponse = PublicHealthResponse & {
  checks: {
    database: boolean;
    smtp: boolean;
    billing: boolean;
    paddleFullyConfigured: boolean;
    marketplacePaidReady: boolean;
    etsyWebhook: boolean;
  };
};

export function buildPublicHealthResponse(input: {
  dbOk: boolean;
  started: number;
}): PublicHealthResponse {
  const ok = input.dbOk;
  return {
    ok,
    status: ok ? 'operational' : 'degraded',
    timestamp: new Date().toISOString(),
    responseMs: Date.now() - input.started,
  };
}

export function buildDetailedHealthResponse(input: {
  dbOk: boolean;
  started: number;
}): DetailedHealthResponse {
  return {
    ...buildPublicHealthResponse(input),
    checks: {
      database: input.dbOk,
      smtp: isSmtpConfigured(),
      billing: isBillingConfigured(),
      paddleFullyConfigured: isPaddleFullyConfigured(),
      marketplacePaidReady:
        MARKETPLACE_PAID_SALES_ENABLED && isMarketplacePayoutConfigured(),
      etsyWebhook: isEtsyWebhookConfigured(),
    },
  };
}

export function healthDetailAuthorized(req: Request): boolean {
  const secret = process.env.HEALTH_DETAIL_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;
  const header = req.headers.get('x-health-secret');
  return header === secret;
}
