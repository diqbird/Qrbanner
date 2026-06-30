import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface CampaignSummary {
  id: string;
  name: string;
  qrCount: number;
  totalScans: number;
  activeCount: number;
  createdAt: string;
}

export async function listCampaignsForUser(userId: string): Promise<CampaignSummary[]> {
  const rows = await prisma.qRCode.findMany({
    where: { userId, isArchived: false, batchId: { not: null } },
    select: {
      batchId: true,
      batchLabel: true,
      totalScans: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const map = new Map<string, CampaignSummary & { earliest: Date }>();

  for (const row of rows) {
    if (!row.batchId) continue;
    const existing = map.get(row.batchId);
    if (!existing) {
      map.set(row.batchId, {
        id: row.batchId,
        name: row.batchLabel?.trim() || `Campaign ${row.batchId.slice(0, 6)}`,
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

  return Array.from(map.values())
    .map(({ earliest: _e, ...rest }) => rest)
    .sort((a, b) => b.totalScans - a.totalScans);
}

export function newCampaignId(): string {
  return crypto.randomBytes(8).toString('hex');
}

export async function createCampaign(userId: string, name: string): Promise<CampaignSummary> {
  const id = newCampaignId();
  const label = name.trim() || 'New campaign';
  return {
    id,
    name: label,
    qrCount: 0,
    totalScans: 0,
    activeCount: 0,
    createdAt: new Date().toISOString(),
  };
}

export async function renameCampaign(userId: string, campaignId: string, name: string): Promise<number> {
  const result = await prisma.qRCode.updateMany({
    where: { userId, batchId: campaignId },
    data: { batchLabel: name.trim() },
  });
  return result.count;
}

export async function assignQrsToCampaign(
  userId: string,
  campaignId: string,
  campaignName: string,
  qrIds: string[]
): Promise<number> {
  const result = await prisma.qRCode.updateMany({
    where: { userId, id: { in: qrIds } },
    data: { batchId: campaignId, batchLabel: campaignName.trim() },
  });
  return result.count;
}

export async function deleteCampaign(userId: string, campaignId: string): Promise<number> {
  const result = await prisma.qRCode.updateMany({
    where: { userId, batchId: campaignId },
    data: { batchId: null, batchLabel: null },
  });
  return result.count;
}
