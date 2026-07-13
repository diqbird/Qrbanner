export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';

/** Capture interest for paid marketplace launch (no Paddle Connect required). */
export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json().catch(() => ({}));
    const listingId = typeof body.listingId === 'string' ? body.listingId.trim() : '';
    const user = await prisma.user.findUnique({
      where: { id: auth },
      select: { email: true, name: true },
    });
    if (!user?.email) {
      return NextResponse.json({ error: 'Account email required' }, { status: 400 });
    }

    await prisma.contactInquiry.create({
      data: {
        type: 'marketplace_paid_interest',
        name: user.name?.trim() || user.email.split('@')[0] || 'Seller',
        email: user.email,
        message: listingId
          ? `Notify when paid marketplace sales open. Listing: ${listingId}`
          : 'Notify when paid marketplace sales and seller payouts open.',
        status: 'open',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Marketplace interest error:', error);
    return NextResponse.json({ error: 'Could not save interest' }, { status: 500 });
  }
}
