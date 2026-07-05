import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
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
  opts?: { paddleSubscriptionId?: string | null; paddleCustomerId?: string | null },
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      ...(opts?.paddleSubscriptionId !== undefined
        ? { paddleSubscriptionId: opts.paddleSubscriptionId }
        : {}),
      ...(opts?.paddleCustomerId !== undefined ? { paddleCustomerId: opts.paddleCustomerId } : {}),
    },
  });
}

async function resolveUserIdFromPaddleSubscription(
  sub: PaddleWebhookSubscription,
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
  if (!paddleSignature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }
  return handlePaddleWebhook(body, paddleSignature);
}
