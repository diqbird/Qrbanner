import { NextResponse } from 'next/server';

import { headers } from 'next/headers';

import Stripe from 'stripe';

import { prisma } from '@/lib/db';

import { getStripe, planIdFromStripePrice } from '@/lib/stripe';

import type { PlanId } from '@/lib/plans';

import {

  isPaddleSubscriptionPaid,

  planFromPaddleSubscription,

  shouldDowngradePaddleSubscription,

  verifyPaddleWebhookSignature,

  type PaddleWebhookSubscription,

} from '@/lib/paddle';

import { claimBillingWebhookEvent, releaseBillingWebhookEvent } from '@/lib/billing-webhook-events';



export const runtime = 'nodejs';



async function setUserPlan(

  userId: string,

  plan: PlanId,

  opts?: { stripeSubscriptionId?: string | null; paddleSubscriptionId?: string | null; paddleCustomerId?: string | null }

) {

  await prisma.user.update({

    where: { id: userId },

    data: {

      plan,

      ...(opts?.stripeSubscriptionId !== undefined

        ? { stripeSubscriptionId: opts.stripeSubscriptionId }

        : {}),

      ...(opts?.paddleSubscriptionId !== undefined

        ? { paddleSubscriptionId: opts.paddleSubscriptionId }

        : {}),

      ...(opts?.paddleCustomerId !== undefined ? { paddleCustomerId: opts.paddleCustomerId } : {}),

    },

  });

}



async function resolveUserIdFromStripeSubscription(sub: Stripe.Subscription): Promise<string | null> {

  if (sub.metadata?.userId) {

    const byMeta = await prisma.user.findUnique({

      where: { id: sub.metadata.userId },

      select: { id: true, stripeCustomerId: true },

    });

    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;

    if (byMeta && (!customerId || !byMeta.stripeCustomerId || byMeta.stripeCustomerId === customerId)) {

      return byMeta.id;

    }

  }



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



async function resolveUserIdFromPaddleSubscription(

  sub: PaddleWebhookSubscription

): Promise<string | null> {

  if (sub.custom_data?.userId) {

    const byMeta = await prisma.user.findUnique({

      where: { id: sub.custom_data.userId },

      select: { id: true, paddleCustomerId: true },

    });

    if (byMeta && (!sub.customer_id || !byMeta.paddleCustomerId || byMeta.paddleCustomerId === sub.customer_id)) {

      return byMeta.id;

    }

  }



  const bySub = await prisma.user.findFirst({

    where: { paddleSubscriptionId: sub.id },

    select: { id: true },

  });

  if (bySub) return bySub.id;



  if (sub.customer_id) {

    const byCustomer = await prisma.user.findFirst({

      where: { paddleCustomerId: sub.customer_id },

      select: { id: true },

    });

    if (byCustomer) return byCustomer.id;

  }



  return null;

}



function isPaidStripeSubscriptionStatus(status: Stripe.Subscription.Status): boolean {

  return status === 'active' || status === 'trialing';

}



function shouldDowngradeStripeSubscription(status: Stripe.Subscription.Status): boolean {

  return (

    status === 'canceled' ||

    status === 'unpaid' ||

    status === 'incomplete_expired' ||

    status === 'past_due'

  );

}



async function verifyStripeCheckoutUser(

  userId: string,

  customerId: string | null | undefined

): Promise<boolean> {

  if (!customerId) return false;

  const user = await prisma.user.findUnique({

    where: { id: userId },

    select: { stripeCustomerId: true },

  });

  return Boolean(user?.stripeCustomerId && user.stripeCustomerId === customerId);

}



async function handleStripeWebhook(body: string, signature: string) {

  const stripe = getStripe();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {

    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });

  }



  let event: Stripe.Event;

  try {

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  } catch (err) {

    console.error('[billing/webhook] Stripe signature error', err);

    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

  }



  const claimed = await claimBillingWebhookEvent('stripe', event.id);

  if (!claimed) {

    return NextResponse.json({ received: true, duplicate: true });

  }



  try {

    switch (event.type) {

      case 'checkout.session.completed': {

        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;

        const plan = (session.metadata?.plan as PlanId) || null;

        const customerId =

          typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;

        if (userId && plan && plan !== 'free') {

          const ok = await verifyStripeCheckoutUser(userId, customerId);

          if (!ok) {

            console.warn('[billing/webhook] Stripe checkout customer mismatch', userId, customerId);

            break;

          }

          await setUserPlan(userId, plan, {

            stripeSubscriptionId: (session.subscription as string | null) ?? null,

          });

        }

        break;

      }

      case 'customer.subscription.updated': {

        const sub = event.data.object as Stripe.Subscription;

        const userId = await resolveUserIdFromStripeSubscription(sub);

        if (!userId) break;



        if (isPaidStripeSubscriptionStatus(sub.status)) {

          const priceId = sub.items.data[0]?.price?.id;

          const plan = priceId ? planIdFromStripePrice(priceId) : null;

          if (plan) await setUserPlan(userId, plan, { stripeSubscriptionId: sub.id });

        } else if (shouldDowngradeStripeSubscription(sub.status)) {

          await setUserPlan(userId, 'free', { stripeSubscriptionId: null });

        }

        break;

      }

      case 'customer.subscription.deleted': {

        const sub = event.data.object as Stripe.Subscription;

        const userId = await resolveUserIdFromStripeSubscription(sub);

        if (userId) await setUserPlan(userId, 'free', { stripeSubscriptionId: null });

        break;

      }

      default:

        break;

    }

  } catch (error) {

    console.error('[billing/webhook] Stripe handler error', event.type, error);

    await releaseBillingWebhookEvent('stripe', event.id);

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });

  }



  return NextResponse.json({ received: true });

}



async function handlePaddleWebhook(body: string, signature: string) {

  if (!verifyPaddleWebhookSignature(body, signature)) {

    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

  }



  let payload: { event_id?: string; event_type?: string; data?: PaddleWebhookSubscription };

  try {

    payload = JSON.parse(body) as { event_id?: string; event_type?: string; data?: PaddleWebhookSubscription };

  } catch {

    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  }



  const eventType = payload.event_type;

  const sub = payload.data;

  if (!eventType || !sub) {

    return NextResponse.json({ received: true });

  }



  const eventId = payload.event_id ?? `${eventType}:${sub.id}`;

  const claimed = await claimBillingWebhookEvent('paddle', eventId);

  if (!claimed) {

    return NextResponse.json({ received: true, duplicate: true });

  }



  try {

    const userId = await resolveUserIdFromPaddleSubscription(sub);

    if (!userId) {

      console.warn('[billing/webhook] Paddle event without user mapping', eventType, sub.id);

      return NextResponse.json({ received: true });

    }



    switch (eventType) {

      case 'subscription.created':

      case 'subscription.updated': {

        if (isPaddleSubscriptionPaid(sub.status)) {

          const plan = planFromPaddleSubscription(sub);

          if (plan) {

            await setUserPlan(userId, plan, {

              paddleSubscriptionId: sub.id,

              paddleCustomerId: sub.customer_id ?? null,

            });

          }

        } else if (shouldDowngradePaddleSubscription(sub.status)) {

          await setUserPlan(userId, 'free', { paddleSubscriptionId: null });

        }

        break;

      }

      case 'subscription.canceled': {

        await setUserPlan(userId, 'free', { paddleSubscriptionId: null });

        break;

      }

      default:

        break;

    }

  } catch (error) {

    console.error('[billing/webhook] Paddle handler error', eventType, error);

    await releaseBillingWebhookEvent('paddle', eventId);

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });

  }



  return NextResponse.json({ received: true });

}



export async function POST(req: Request) {

  const body = await req.text();

  const headerStore = await headers();

  const paddleSignature = headerStore.get('paddle-signature');

  if (paddleSignature) {

    return handlePaddleWebhook(body, paddleSignature);

  }



  const stripeSignature = headerStore.get('stripe-signature');

  if (stripeSignature) {

    return handleStripeWebhook(body, stripeSignature);

  }



  return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

}

