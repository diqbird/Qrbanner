import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { getStripe, planIdFromStripePrice } from '@/lib/stripe';
import type { PlanId } from '@/lib/plans';

export const runtime = 'nodejs';

async function setUserPlan(userId: string, plan: PlanId, subscriptionId?: string | null) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      ...(subscriptionId !== undefined ? { stripeSubscriptionId: subscriptionId } : {}),
    },
  });
}

async function resolveUserIdFromSubscription(sub: Stripe.Subscription): Promise<string | null> {
  if (sub.metadata?.userId) return sub.metadata.userId;

  const bySub = await prisma.user.findFirst({
    where: { stripeSubscriptionId: sub.id },
    select: { id: true },
  });
  if (bySub) return bySub.id;

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
  if (customerId) {
    const byCustomer = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (byCustomer) return byCustomer.id;
  }

  return null;
}

function isPaidSubscriptionStatus(status: Stripe.Subscription.Status): boolean {
  return status === 'active' || status === 'trialing';
}

function shouldDowngradeSubscription(status: Stripe.Subscription.Status): boolean {
  return (
    status === 'canceled' ||
    status === 'unpaid' ||
    status === 'incomplete_expired' ||
    status === 'past_due'
  );
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });
  }

  const body = await req.text();
  const signature = headers().get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[billing/webhook] signature error', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan as PlanId) || null;
        if (userId && plan && plan !== 'free') {
          await setUserPlan(userId, plan, session.subscription as string | null);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserIdFromSubscription(sub);
        if (!userId) break;

        if (isPaidSubscriptionStatus(sub.status)) {
          const priceId = sub.items.data[0]?.price?.id;
          const plan = priceId ? planIdFromStripePrice(priceId) : null;
          if (plan) await setUserPlan(userId, plan, sub.id);
        } else if (shouldDowngradeSubscription(sub.status)) {
          await setUserPlan(userId, 'free', null);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserIdFromSubscription(sub);
        if (userId) await setUserPlan(userId, 'free', null);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('[billing/webhook] handler error', event.type, error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
