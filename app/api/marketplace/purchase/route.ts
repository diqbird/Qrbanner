export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { splitMarketplaceFee } from '@/lib/marketplace-types';
import { createListingCheckoutSession } from '@/lib/marketplace-connect';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

export async function POST(req: NextRequest) {
  const auth = await requireSessionContext();
  if (isAuthError(auth)) return auth;
  const { userId, email } = auth;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const listingId = String(body.listingId ?? '').trim();
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    include: { seller: true },
  });
  if (!listing || listing.status !== 'published') {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }
  if (listing.seller.userId === userId) {
    return NextResponse.json({ error: 'Cannot purchase your own listing' }, { status: 400 });
  }

  if (listing.priceCents <= 0) {
    const purchase = await prisma.marketplacePurchase.create({
      data: {
        listingId: listing.id,
        buyerId: userId,
        amountCents: 0,
        platformFeeCents: 0,
        sellerNetCents: 0,
        status: 'completed',
      },
    });
    return NextResponse.json({
      ok: true,
      free: true,
      purchaseId: purchase.id,
      templateId: listing.templateId,
      redirect: listing.templateId
        ? `/qr/create?template=${encodeURIComponent(listing.templateId)}`
        : '/qr/create',
    });
  }

  if (!listing.seller.stripeConnectId || !listing.seller.connectOnboardingDone) {
    return NextResponse.json({ fallback: 'stripe_connect_required' }, { status: 503 });
  }

  const { platformFeeCents } = splitMarketplaceFee(listing.priceCents);

  const purchase = await prisma.marketplacePurchase.create({
    data: {
      listingId: listing.id,
      buyerId: userId,
      amountCents: listing.priceCents,
      platformFeeCents,
      sellerNetCents: listing.priceCents - platformFeeCents,
      currency: listing.currency,
      status: 'pending',
    },
  });

  const checkout = await createListingCheckoutSession({
    listingId: listing.id,
    buyerId: userId,
    buyerEmail: email,
    amountCents: listing.priceCents,
    currency: listing.currency,
    sellerConnectId: listing.seller.stripeConnectId,
    platformFeeCents,
    title: listing.title,
  });

  if ('fallback' in checkout) {
    await prisma.marketplacePurchase.update({
      where: { id: purchase.id },
      data: { status: 'failed' },
    });
    return NextResponse.json({ fallback: checkout.fallback }, { status: 503 });
  }

  return NextResponse.json({ url: checkout.url, purchaseId: purchase.id });
}
