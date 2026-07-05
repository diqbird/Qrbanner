export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sanitizeListingInput } from '@/lib/marketplace-sanitize';
import { canUserSellOnMarketplace, getOrCreateSeller } from '@/lib/marketplace-seller';
import { getSessionUserId, requireSessionContext, isAuthError } from '@/lib/session-auth';

const publicSelect = {
  id: true,
  title: true,
  description: true,
  priceCents: true,
  currency: true,
  templateId: true,
  category: true,
  previewUrl: true,
  status: true,
  createdAt: true,
  seller: {
    select: { displayName: true, connectOnboardingDone: true },
  },
} as const;

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const mine = req.nextUrl.searchParams.get('mine') === '1';

  if (mine) {
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const seller = await prisma.marketplaceSeller.findUnique({ where: { userId } });
    if (!seller) return NextResponse.json({ listings: [], limit: 0, count: 0 });
    const sellCheck = await canUserSellOnMarketplace(userId);
    const listings = await prisma.marketplaceListing.findMany({
      where: { sellerId: seller.id, status: { not: 'archived' } },
      orderBy: { updatedAt: 'desc' },
      select: publicSelect,
    });
    return NextResponse.json({
      listings,
      limit: sellCheck.limit,
      count: sellCheck.count,
    });
  }

  const listings = await prisma.marketplaceListing.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: publicSelect,
  });

  return NextResponse.json({ listings });
}

export async function POST(req: NextRequest) {
  const auth = await requireSessionContext();
  if (isAuthError(auth)) return auth;
  const { userId, email, name } = auth;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sellCheck = await canUserSellOnMarketplace(userId);
  if (!sellCheck.ok) {
    return NextResponse.json({ error: sellCheck.reason }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const input = sanitizeListingInput(body);
  if (!input) return NextResponse.json({ error: 'Invalid listing' }, { status: 400 });

  const seller = await getOrCreateSeller(userId, name ?? email.split('@')[0]);
  if (input.priceCents > 0 && !seller.connectOnboardingDone) {
    return NextResponse.json(
      { error: 'Complete Stripe Connect onboarding before selling paid templates.' },
      { status: 403 }
    );
  }

  const listing = await prisma.marketplaceListing.create({
    data: {
      sellerId: seller.id,
      title: input.title,
      description: input.description,
      priceCents: input.priceCents,
      templateId: input.templateId,
      category: input.category,
      previewUrl: input.previewUrl,
      status: input.status === 'published' ? 'published' : 'draft',
    },
    select: publicSelect,
  });

  return NextResponse.json({ listing });
}
