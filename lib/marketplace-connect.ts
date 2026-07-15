import { prisma } from '@/lib/db';
import { siteBaseUrl } from '@/lib/billing-provider';
import {
  createPaddleMarketplaceCheckout,
  isPaddleMarketplaceReady,
} from '@/lib/paddle';
import { getOrCreateSeller } from '@/lib/marketplace-seller';

/** Platform-mediated Paddle checkout is live when API + client token exist. */
export function isMarketplacePayoutConfigured(): boolean {
  return isPaddleMarketplaceReady();
}

export async function refreshConnectStatus(_userId: string): Promise<void> {
  // Soft onboard — no external Connect status to refresh.
}

/** Soft payout agreement: platform collects via Paddle; sellerNet paid manually. */
export async function createConnectOnboardingLink(
  userId: string,
  email: string,
): Promise<{ ready: true } | { fallback: string }> {
  if (!isMarketplacePayoutConfigured()) {
    return { fallback: 'payouts_not_available' };
  }

  const display = email.split('@')[0] || 'Seller';
  await getOrCreateSeller(userId, display);
  await prisma.marketplaceSeller.update({
    where: { userId },
    data: {
      connectOnboardingDone: true,
      payoutsEnabled: true,
    },
  });

  return { ready: true };
}

export async function createListingCheckoutSession(params: {
  purchaseId: string;
  listingId: string;
  buyerId: string;
  buyerEmail: string;
  buyerName?: string | null;
  amountCents: number;
  currency: string;
  platformFeeCents: number;
  title: string;
  templateId?: string | null;
}): Promise<{ url: string; transactionId: string } | { fallback: string }> {
  if (!isMarketplacePayoutConfigured()) {
    return { fallback: 'payouts_not_available' };
  }

  try {
    const buyer = await prisma.user.findUnique({
      where: { id: params.buyerId },
      select: { paddleCustomerId: true, name: true },
    });

    const checkout = await createPaddleMarketplaceCheckout({
      purchaseId: params.purchaseId,
      listingId: params.listingId,
      buyerId: params.buyerId,
      email: params.buyerEmail,
      name: params.buyerName ?? buyer?.name ?? null,
      paddleCustomerId: buyer?.paddleCustomerId ?? null,
      amountCents: params.amountCents,
      currency: params.currency,
      title: params.title,
      successUrl: `${siteBaseUrl()}/marketplace/${params.listingId}?paid=1&purchase=${encodeURIComponent(params.purchaseId)}`,
    });

    if (buyer && !buyer.paddleCustomerId) {
      await prisma.user.update({
        where: { id: params.buyerId },
        data: { paddleCustomerId: checkout.customerId },
      });
    }

    await prisma.marketplacePurchase.update({
      where: { id: params.purchaseId },
      data: { paddleTransactionId: checkout.transactionId },
    });

    return { url: checkout.url, transactionId: checkout.transactionId };
  } catch (error) {
    console.error('[marketplace] checkout failed', error);
    return { fallback: 'payouts_not_available' };
  }
}

export { siteBaseUrl };
