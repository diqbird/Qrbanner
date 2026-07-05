import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { activeBillingProvider, isBillingConfigured, siteBaseUrl } from '@/lib/billing-provider';
import { createPaddlePortalSession, ensurePaddleCustomer } from '@/lib/paddle';
import { getStripe } from '@/lib/stripe';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

export async function POST() {
  try {
    if (!isBillingConfigured()) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
    }

    const auth = await requireSessionContext();
    if (isAuthError(auth)) return auth;
    if (!auth.email) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.email },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        paddleCustomerId: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const provider = activeBillingProvider();

    if (provider === 'paddle') {
      let customerId = user.paddleCustomerId;
      if (!customerId) {
        customerId = await ensurePaddleCustomer({
          userId: user.id,
          email: user.email,
          name: user.name,
          existingCustomerId: null,
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { paddleCustomerId: customerId },
        });
      }

      const url = await createPaddlePortalSession(customerId);
      return NextResponse.json({ url });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe unavailable' }, { status: 503 });
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

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteBaseUrl()}/settings`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('[billing/portal]', error);
    return NextResponse.json({ error: 'Could not open billing portal' }, { status: 500 });
  }
}
