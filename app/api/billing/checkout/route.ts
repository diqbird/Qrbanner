import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { activeBillingProvider, isBillingConfigured, siteBaseUrl } from '@/lib/billing-provider';
import { createPaddleCheckout } from '@/lib/paddle';
import { getStripe, stripePriceIdForPlan } from '@/lib/stripe';
import type { PlanId } from '@/lib/plans';
import { normalizePlanId, type BillingInterval } from '@/lib/plans';
import { referralCouponForCheckout } from '@/lib/referral-checkout';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

async function upgradeExistingStripeSubscription(
  stripe: NonNullable<ReturnType<typeof getStripe>>,
  subscriptionId: string,
  priceId: string,
  userId: string,
  plan: PlanId
): Promise<boolean> {
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!sub || sub.status === 'canceled') return false;
    if (sub.status !== 'active' && sub.status !== 'trialing') return false;

    const itemId = sub.items.data[0]?.id;
    if (!itemId) return false;

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: 'create_prorations',
      metadata: { userId, plan },
    });

    return true;
  } catch (error) {
    console.error('[billing/checkout] Stripe subscription update failed', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plan = normalizePlanId(body?.plan) as PlanId;
    const interval: BillingInterval = body?.interval === 'annual' ? 'annual' : 'monthly';

    if (plan === 'free') {
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 });
    }

    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: 'billing_not_configured', message: 'Paid plans are not available yet.' },
        { status: 503 }
      );
    }

    const auth = await requireSessionContext();
    if (isAuthError(auth)) return auth;
    if (!auth.email) {
      return NextResponse.json({ error: 'Sign in required', signIn: true }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        paddleCustomerId: true,
        paddleSubscriptionId: true,
        referralSignupCount: true,
        brandingSettings: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.plan === plan) {
      return NextResponse.json(
        { error: 'You are already on this plan', manageBilling: true },
        { status: 400 }
      );
    }

    const successUrl = `${siteBaseUrl()}/settings?billing=success`;
    const provider = activeBillingProvider();

    if (provider === 'paddle') {
      const result = await createPaddleCheckout({
        userId: user.id,
        email: user.email,
        name: user.name,
        plan,
        interval,
        paddleCustomerId: user.paddleCustomerId,
        paddleSubscriptionId: user.paddleSubscriptionId,
        successUrl,
      });

      if ('upgraded' in result) {
        return NextResponse.json({ url: successUrl, pendingPlanSync: true });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { paddleCustomerId: result.customerId },
      });
      return NextResponse.json({ url: result.url, transactionId: result.transactionId });
    }

    const stripe = getStripe();
    const priceId = stripePriceIdForPlan(plan, interval);
    if (!stripe || !priceId) {
      return NextResponse.json(
        {
          error: 'billing_not_configured',
          message:
            interval === 'annual'
              ? 'Annual billing is not configured for this plan.'
              : 'Stripe price IDs are not configured.',
        },
        { status: 503 }
      );
    }

    if (user.stripeSubscriptionId) {
      const upgraded = await upgradeExistingStripeSubscription(
        stripe,
        user.stripeSubscriptionId,
        priceId,
        user.id,
        plan
      );
      if (upgraded) {
        return NextResponse.json({ url: successUrl, pendingPlanSync: true });
      }
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
    } else {
      const activeSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      });
      if (activeSubs.data[0]) {
        const upgraded = await upgradeExistingStripeSubscription(
          stripe,
          activeSubs.data[0].id,
          priceId,
          user.id,
          plan
        );
        if (upgraded) {
          return NextResponse.json({ url: successUrl });
        }
      }
    }

    const referralCoupon = referralCouponForCheckout(
      user.referralSignupCount,
      user.brandingSettings,
      plan,
      interval
    );

    const taxEnabled = process.env.STRIPE_AUTOMATIC_TAX === 'true';

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(taxEnabled
        ? {
            automatic_tax: { enabled: true },
            customer_update: { address: 'auto', name: 'auto' },
            billing_address_collection: 'auto',
            tax_id_collection: { enabled: true },
          }
        : {}),
      ...(referralCoupon ? { discounts: [{ coupon: referralCoupon }] } : {}),
      success_url: referralCoupon
        ? `${siteBaseUrl()}/settings?billing=referral_reward`
        : successUrl,
      cancel_url: `${siteBaseUrl()}/pricing?billing=cancelled`,
      metadata: {
        userId: user.id,
        plan,
        ...(referralCoupon ? { referralReward: 'true' } : {}),
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
          ...(referralCoupon ? { referralReward: 'true' } : {}),
        },
      },
    });

    return NextResponse.json({
      url: checkout.url,
      ...(referralCoupon ? { referralReward: true } : {}),
    });
  } catch (error) {
    console.error('[billing/checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
