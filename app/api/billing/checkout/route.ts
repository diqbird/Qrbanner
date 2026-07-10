import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isBillingConfigured, siteBaseUrl } from '@/lib/billing-provider';
import { createPaddleCheckout, paddlePriceIdForPlan } from '@/lib/paddle';
import type { PlanId } from '@/lib/plans';
import { normalizePlanId, type BillingInterval } from '@/lib/plans';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

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

    if (!paddlePriceIdForPlan(plan, interval)) {
      return NextResponse.json(
        {
          error: 'billing_not_configured',
          message:
            interval === 'annual'
              ? 'Annual billing is not configured for this plan yet.'
              : 'This plan is not available for checkout yet.',
        },
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
        paddleCustomerId: true,
        paddleSubscriptionId: true,
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
  } catch (error) {
    console.error('[billing/checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
