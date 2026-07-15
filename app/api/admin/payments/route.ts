export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { estimatedMrr, planCountsFromGroupBy } from '@/lib/admin-billing-stats';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const [events, paddleByPlan, paddleSubscribers, marketplacePurchases] = await Promise.all([
    prisma.billingWebhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.user.groupBy({
      by: ['plan'],
      where: {
        paddleSubscriptionId: { not: null },
        plan: { in: ['pro', 'business', 'agency'] },
      },
      _count: { id: true },
    }),
    prisma.user.count({ where: { paddleSubscriptionId: { not: null } } }),
    prisma.marketplacePurchase.findMany({
      where: { status: 'completed', amountCents: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        amountCents: true,
        platformFeeCents: true,
        sellerNetCents: true,
        currency: true,
        settledAt: true,
        settleNote: true,
        createdAt: true,
        paddleTransactionId: true,
        listing: {
          select: {
            title: true,
            seller: { select: { displayName: true, user: { select: { email: true } } } },
          },
        },
        buyer: { select: { email: true } },
      },
    }),
  ]);

  const paddlePlanCounts = planCountsFromGroupBy(paddleByPlan);
  const unsettledSellerNet = marketplacePurchases
    .filter((p) => !p.settledAt)
    .reduce((sum, p) => sum + p.sellerNetCents, 0);

  return NextResponse.json({
    estimatedMrr: estimatedMrr(paddlePlanCounts),
    paddleSubscribers,
    webhookEvents: events,
    marketplacePurchases,
    unsettledSellerNetCents: unsettledSellerNet,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => ({}));
  const purchaseId = String(body.purchaseId ?? '').trim();
  if (!purchaseId) return NextResponse.json({ error: 'purchaseId required' }, { status: 400 });

  const settle = body.settle !== false;
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : undefined;

  const existing = await prisma.marketplacePurchase.findUnique({
    where: { id: purchaseId },
    select: { id: true, status: true, amountCents: true },
  });
  if (!existing || existing.status !== 'completed' || existing.amountCents <= 0) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
  }

  const updated = await prisma.marketplacePurchase.update({
    where: { id: purchaseId },
    data: settle
      ? { settledAt: new Date(), ...(note !== undefined ? { settleNote: note || null } : {}) }
      : { settledAt: null, settleNote: note ?? null },
    select: { id: true, settledAt: true, settleNote: true, sellerNetCents: true },
  });

  return NextResponse.json({ purchase: updated });
}
