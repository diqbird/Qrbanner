import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { getStripe, isStripeConfigured, siteBaseUrl } from '@/lib/stripe';

export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
