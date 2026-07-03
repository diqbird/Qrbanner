import { prisma } from '@/lib/db';
import { getPlanLimits } from '@/lib/plans';

export async function canUserSellOnMarketplace(userId: string): Promise<{
  ok: boolean;
  limit: number;
  count: number;
  reason?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  const plan = getPlanLimits(user?.plan);
  if (plan.maxMarketplaceListings <= 0) {
    return {
      ok: false,
      limit: 0,
      count: 0,
      reason: 'Marketplace selling requires a Pro plan or higher.',
    };
  }

  const seller = await prisma.marketplaceSeller.findUnique({
    where: { userId },
    select: { id: true },
  });
  const count = seller
    ? await prisma.marketplaceListing.count({
        where: { sellerId: seller.id, status: { not: 'archived' } },
      })
    : 0;

  if (count >= plan.maxMarketplaceListings) {
    return {
      ok: false,
      limit: plan.maxMarketplaceListings,
      count,
      reason: `Listing limit reached (${plan.maxMarketplaceListings} on ${plan.name} plan).`,
    };
  }

  return { ok: true, limit: plan.maxMarketplaceListings, count };
}

export async function getOrCreateSeller(userId: string, displayName: string) {
  const existing = await prisma.marketplaceSeller.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.marketplaceSeller.create({
    data: {
      userId,
      displayName: displayName.slice(0, 80) || 'Creator',
    },
  });
}
