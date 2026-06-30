import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { getStripe, isStripeConfigured, siteBaseUrl, stripePriceIdForPlan } from '@/lib/stripe';
import type { PlanId } from '@/lib/plans';
import { normalizePlanId, type BillingInterval } from '@/lib/plans';
import { referralClaimedBranding, referralCouponForCheckout } from '@/lib/referral-checkout';

async function upgradeExistingSubscription(
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

    await prisma.user.update({
      where: { id: userId },
      data: { plan, stripeSubscriptionId: subscriptionId },
    });
    return true;
  } catch (error) {
    console.error('[billing/checkout] subscription update failed', error);
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

    if (!isStripeConfigured()) {
      return NextResponse.json({ fallback: 'launch_free' });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in required', signIn: true }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
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

    const stripe = getStripe();
    let priceId = stripePriceIdForPlan(plan, interval);
    if (!priceId && interval === 'annual') {
      priceId = stripePriceIdForPlan(plan, 'monthly');
    }
    if (!stripe || !priceId) {
      return NextResponse.json({ fallback: 'launch_free' });
    }

    const successUrl = `${siteBaseUrl()}/settings?billing=success`;

    if (user.stripeSubscriptionId) {
      const upgraded = await upgradeExistingSubscription(
        stripe,
        user.stripeSubscriptionId,
        priceId,
        user.id,
        plan
      );
      if (upgraded) {
        return NextResponse.json({ url: successUrl });
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
        const upgraded = await upgradeExistingSubscription(
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

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
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

    if (referralCoupon) {
      await prisma.user.update({
        where: { id: user.id },
        data: { brandingSettings: referralClaimedBranding(user.brandingSettings) },
      });
    }

    return NextResponse.json({
      url: checkout.url,
      ...(referralCoupon ? { referralReward: true } : {}),
    });
  } catch (error) {
    console.error('[billing/checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
