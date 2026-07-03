import { getStripe, isStripeConfigured, siteBaseUrl } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export function isStripeConnectConfigured(): boolean {
  return isStripeConfigured() && Boolean(process.env.STRIPE_CONNECT_CLIENT_ID);
}

export async function ensureConnectAccount(userId: string, email: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe || !isStripeConnectConfigured()) return null;

  const seller = await prisma.marketplaceSeller.findUnique({ where: { userId } });
  if (seller?.stripeConnectId) return seller.stripeConnectId;

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: { userId },
  });

  if (seller) {
    await prisma.marketplaceSeller.update({
      where: { id: seller.id },
      data: { stripeConnectId: account.id },
    });
  }

  return account.id;
}

export async function createConnectOnboardingLink(
  userId: string,
  email: string
): Promise<{ url: string } | { fallback: string }> {
  const stripe = getStripe();
  if (!stripe || !isStripeConnectConfigured()) {
    return { fallback: 'stripe_connect_required' };
  }

  const accountId = await ensureConnectAccount(userId, email);
  if (!accountId) return { fallback: 'stripe_connect_required' };

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${siteBaseUrl()}/settings?connect=refresh`,
    return_url: `${siteBaseUrl()}/settings?connect=success`,
    type: 'account_onboarding',
  });

  return { url: link.url };
}

export async function refreshConnectStatus(userId: string): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;

  const seller = await prisma.marketplaceSeller.findUnique({ where: { userId } });
  if (!seller?.stripeConnectId) return;

  const account = await stripe.accounts.retrieve(seller.stripeConnectId);
  await prisma.marketplaceSeller.update({
    where: { id: seller.id },
    data: {
      connectOnboardingDone: Boolean(account.details_submitted),
      payoutsEnabled: Boolean(account.payouts_enabled),
    },
  });
}

export async function createListingCheckoutSession(params: {
  listingId: string;
  buyerId: string;
  buyerEmail: string;
  amountCents: number;
  currency: string;
  sellerConnectId: string;
  platformFeeCents: number;
  title: string;
}): Promise<{ url: string } | { fallback: string }> {
  const stripe = getStripe();
  if (!stripe || !isStripeConnectConfigured()) {
    return { fallback: 'stripe_connect_required' };
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: params.buyerEmail,
    line_items: [
      {
        price_data: {
          currency: params.currency,
          unit_amount: params.amountCents,
          product_data: { name: params.title },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: params.platformFeeCents,
      transfer_data: { destination: params.sellerConnectId },
      metadata: {
        listingId: params.listingId,
        buyerId: params.buyerId,
      },
    },
    success_url: `${siteBaseUrl()}/templates?purchase=success`,
    cancel_url: `${siteBaseUrl()}/marketplace/${params.listingId}?purchase=cancelled`,
    metadata: {
      listingId: params.listingId,
      buyerId: params.buyerId,
      type: 'marketplace_listing',
    },
  });

  if (!session.url) return { fallback: 'checkout_failed' };
  return { url: session.url };
}
