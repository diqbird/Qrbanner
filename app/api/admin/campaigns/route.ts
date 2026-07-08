export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';

type CampaignRow = {
  id: string;
  name: string;
  ownerEmail: string;
  qrCount: number;
  totalScans: number;
  activeCount: number;
  createdAt: string;
};

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const rows = await prisma.qRCode.findMany({
    where: { batchId: { not: null }, isArchived: false },
    orderBy: { createdAt: 'desc' },
    take: 2000,
    select: {
      batchId: true,
      batchLabel: true,
      totalScans: true,
      isActive: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  const map = new Map<string, CampaignRow & { earliest: Date }>();
  for (const row of rows) {
    if (!row.batchId) continue;
    const existing = map.get(row.batchId);
    if (!existing) {
      map.set(row.batchId, {
        id: row.batchId,
        name: row.batchLabel?.trim() || `Campaign ${row.batchId.slice(0, 6)}`,
        ownerEmail: row.user.email,
        qrCount: 1,
        totalScans: row.totalScans,
        activeCount: row.isActive ? 1 : 0,
        createdAt: row.createdAt.toISOString(),
        earliest: row.createdAt,
      });
    } else {
      existing.qrCount += 1;
      existing.totalScans += row.totalScans;
      if (row.isActive) existing.activeCount += 1;
      if (row.createdAt < existing.earliest) {
        existing.earliest = row.createdAt;
        existing.createdAt = row.createdAt.toISOString();
      }
      if (row.batchLabel?.trim()) existing.name = row.batchLabel.trim();
    }
  }

  const campaigns = Array.from(map.values())
    .map(({ earliest: _e, ...rest }) => rest)
    .sort((a, b) => b.totalScans - a.totalScans)
    .slice(0, 200);

  return NextResponse.json({
    campaigns,
    total: map.size,
    totalQrCodes: rows.length,
    totalScans: campaigns.reduce((sum, c) => sum + c.totalScans, 0),
  });
}
