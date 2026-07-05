import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isBillingConfigured, siteBaseUrl } from '@/lib/billing-provider';
import { createPaddlePortalSession, ensurePaddleCustomer } from '@/lib/paddle';
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
        paddleCustomerId: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
  } catch (error) {
    console.error('[billing/portal]', error);
    return NextResponse.json({ error: 'Could not open billing portal' }, { status: 500 });
  }
}
