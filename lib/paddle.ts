import crypto from 'crypto';
import type { BillingInterval, PlanId } from '@/lib/plans';
import { siteBaseUrl } from '@/lib/billing-provider';

const PADDLE_API_BASE =
  process.env.PADDLE_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com';

type PaddleResponse<T> = {
  data: T;
  error?: { detail?: string; code?: string };
};

async function paddleRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) throw new Error('Paddle not configured');

  const res = await fetch(`${PADDLE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(15000),
  });

  const json = (await res.json()) as PaddleResponse<T> & { error?: { detail?: string } };
  if (!res.ok) {
    const detail = json.error?.detail ?? JSON.stringify(json);
    throw new Error(`Paddle API ${res.status}: ${detail}`);
  }
  return json.data;
}

export function isPaddleConfigured(): boolean {
  return Boolean(
    process.env.PADDLE_API_KEY &&
      process.env.PADDLE_PRICE_PRO &&
      process.env.PADDLE_PRICE_BUSINESS
  );
}

export function paddleClientToken(): string | null {
  return process.env.PADDLE_CLIENT_TOKEN ?? null;
}

export function paddleEnvironment(): 'sandbox' | 'production' {
  return process.env.PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
}

export function paddleCheckoutPageUrl(): string {
  return `${siteBaseUrl()}/pay`;
}

export function paddlePriceIdForPlan(plan: PlanId, interval: BillingInterval = 'monthly'): string | null {
  if (plan === 'pro') {
    if (interval === 'annual') return process.env.PADDLE_PRICE_PRO_ANNUAL ?? null;
    return process.env.PADDLE_PRICE_PRO ?? null;
  }
  if (plan === 'business') {
    if (interval === 'annual') return process.env.PADDLE_PRICE_BUSINESS_ANNUAL ?? null;
    return process.env.PADDLE_PRICE_BUSINESS ?? null;
  }
  if (plan === 'agency') {
    if (interval === 'annual') return process.env.PADDLE_PRICE_AGENCY_ANNUAL ?? null;
    return process.env.PADDLE_PRICE_AGENCY ?? null;
  }
  return null;
}

export function planIdFromPaddlePrice(priceId: string): PlanId | null {
  const proPrices = [process.env.PADDLE_PRICE_PRO, process.env.PADDLE_PRICE_PRO_ANNUAL].filter(Boolean);
  const businessPrices = [
    process.env.PADDLE_PRICE_BUSINESS,
    process.env.PADDLE_PRICE_BUSINESS_ANNUAL,
  ].filter(Boolean);
  const agencyPrices = [
    process.env.PADDLE_PRICE_AGENCY,
    process.env.PADDLE_PRICE_AGENCY_ANNUAL,
  ].filter(Boolean);
  if (proPrices.includes(priceId)) return 'pro';
  if (businessPrices.includes(priceId)) return 'business';
  if (agencyPrices.includes(priceId)) return 'agency';
  return null;
}

export function verifyPaddleWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(';').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    })
  ) as { ts?: string; h1?: string };

  const { ts, h1 } = parts;
  if (!ts || !h1) return false;

  const ageSec = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(ageSec) || ageSec > 300) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected));
  } catch {
    return false;
  }
}

type PaddleCustomer = { id: string };
type PaddleSubscription = {
  id: string;
  status: string;
  customer_id: string;
  items?: { price?: { id?: string } }[];
  custom_data?: Record<string, string>;
};
type PaddleTransaction = {
  id: string;
  checkout?: { url?: string };
};
type PaddlePortalSession = {
  urls?: { general?: string };
};

export async function ensurePaddleCustomer(params: {
  userId: string;
  email: string;
  name: string | null;
  existingCustomerId: string | null;
}): Promise<string> {
  if (params.existingCustomerId) return params.existingCustomerId;

  const customer = await paddleRequest<PaddleCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      name: params.name ?? undefined,
      custom_data: { userId: params.userId },
    }),
  });
  return customer.id;
}

async function upgradePaddleSubscription(
  subscriptionId: string,
  priceId: string,
  userId: string,
  plan: PlanId
): Promise<boolean> {
  try {
    const sub = await paddleRequest<PaddleSubscription>(`/subscriptions/${subscriptionId}`);
    if (!sub || sub.status === 'canceled') return false;
    if (sub.status !== 'active' && sub.status !== 'trialing' && sub.status !== 'past_due') {
      return false;
    }

    await paddleRequest<PaddleSubscription>(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        proration_billing_mode: 'prorated_immediately',
        custom_data: { userId, plan },
      }),
    });
    return true;
  } catch (error) {
    console.error('[paddle] subscription upgrade failed', error);
    return false;
  }
}

export async function createPaddleCheckout(params: {
  userId: string;
  email: string;
  name: string | null;
  plan: PlanId;
  interval: BillingInterval;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
  successUrl?: string;
}): Promise<{ url: string; customerId: string; transactionId: string } | { upgraded: true }> {
  let priceId = paddlePriceIdForPlan(params.plan, params.interval);
  if (!priceId) {
    throw new Error(params.interval === 'annual' ? 'Paddle annual price not configured' : 'Paddle price not configured');
  }

  const successUrl = params.successUrl ?? `${siteBaseUrl()}/settings?billing=success`;
  const checkoutPageUrl = paddleCheckoutPageUrl();

  if (params.paddleSubscriptionId) {
    const upgraded = await upgradePaddleSubscription(
      params.paddleSubscriptionId,
      priceId,
      params.userId,
      params.plan
    );
    if (upgraded) return { upgraded: true };
  }

  const customerId = await ensurePaddleCustomer({
    userId: params.userId,
    email: params.email,
    name: params.name,
    existingCustomerId: params.paddleCustomerId,
  });

  const transaction = await paddleRequest<PaddleTransaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      customer_id: customerId,
      custom_data: { userId: params.userId, plan: params.plan },
      collection_mode: 'automatic',
      checkout: {
        url: checkoutPageUrl,
        settings: { success_url: successUrl },
      },
    }),
  });

  const url = transaction.checkout?.url;
  if (!url) throw new Error('Paddle checkout URL missing');

  return { url, customerId, transactionId: transaction.id };
}

export async function createPaddlePortalSession(customerId: string): Promise<string> {
  const session = await paddleRequest<PaddlePortalSession>(`/customers/${customerId}/portal-sessions`, {
    method: 'POST',
    body: JSON.stringify({
      return_urls: { default: `${siteBaseUrl()}/settings` },
    }),
  });
  const url = session.urls?.general;
  if (!url) throw new Error('Paddle portal URL missing');
  return url;
}

export type PaddleWebhookSubscription = PaddleSubscription;

export function planFromPaddleSubscription(sub: PaddleSubscription): PlanId | null {
  const priceId = sub.items?.[0]?.price?.id;
  if (priceId) {
    const fromPrice = planIdFromPaddlePrice(priceId);
    if (fromPrice) return fromPrice;
  }
  const customPlan = sub.custom_data?.plan;
  if (customPlan === 'pro' || customPlan === 'business' || customPlan === 'agency') {
    return customPlan;
  }
  return null;
}

export function isPaddleSubscriptionPaid(status: string): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}

export function shouldDowngradePaddleSubscription(status: string): boolean {
  return status === 'canceled';
}
