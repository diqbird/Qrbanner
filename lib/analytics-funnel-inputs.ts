import { prisma } from '@/lib/db';

type DateFilter = { gte?: Date; lte?: Date } | undefined;

export async function fetchFunnelEventCounts(
  qrIds: string[],
  dateFilter: DateFilter,
): Promise<{ ctaClicks: number; leads: number }> {
  if (!qrIds.length) return { ctaClicks: 0, leads: 0 };

  const [ctaClicks, leads] = await Promise.all([
    prisma.landingCtaClick.count({
      where: {
        qrCodeId: { in: qrIds },
        ...(dateFilter ? { clickedAt: dateFilter } : {}),
      },
    }),
    prisma.leadSubmission.count({
      where: {
        qrCodeId: { in: qrIds },
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
    }),
  ]);

  return { ctaClicks, leads };
}
