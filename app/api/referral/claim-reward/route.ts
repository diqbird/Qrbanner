export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { activeBillingProvider } from '@/lib/billing-provider';
import { getStripe, isStripeConfigured, siteBaseUrl, stripePriceIdForPlan } from '@/lib/stripe';
import { canClaimReferralReward, referralRewardCouponId } from '@/lib/referral-stripe';
import { referralClaimedBranding } from '@/lib/referral-checkout';
import { parseBrandingSettings } from '@/lib/referral';

/** Claim 5-referral Pro reward — Stripe Checkout with referral coupon. */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const provider = activeBillingProvider();
    const couponId = referralRewardCouponId();
    if (provider !== 'stripe' || !couponId || !isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Referral reward checkout is not available with the current billing provider' },
        { status: 501 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        referralSignupCount: true,
        stripeCustomerId: true,
        brandingSettings: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const branding = parseBrandingSettings(user.brandingSettings);
    if (!canClaimReferralReward(user.referralSignupCount, Boolean(branding.referralRewardClaimed))) {
      return NextResponse.json({ error: 'Reward not available' }, { status: 403 });
    }

    const stripe = getStripe();
    const priceId = stripePriceIdForPlan('pro', 'monthly');
    if (!stripe || !priceId) {
      return NextResponse.json({ error: 'Billing unavailable' }, { status: 503 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      discounts: [{ coupon: couponId }],
      success_url: `${siteBaseUrl()}/settings?billing=referral_reward`,
      cancel_url: `${siteBaseUrl()}/settings?billing=cancelled`,
      metadata: { userId: user.id, plan: 'pro', referralReward: 'true' },
      subscription_data: {
        metadata: { userId: user.id, plan: 'pro', referralReward: 'true' },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        brandingSettings: referralClaimedBranding(user.brandingSettings),
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error('[referral claim-reward]', error);
    return NextResponse.json({ error: 'Could not start reward checkout' }, { status: 500 });
  }
}
