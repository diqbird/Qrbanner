import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { generateShortCode } from '@/lib/qr-utils';

export const QR_LIST_SELECT = {
  id: true,
  name: true,
  shortCode: true,
  category: true,
  targetUrl: true,
  isActive: true,
  isFavorite: true,
  isArchived: true,
  totalScans: true,
  batchId: true,
  batchLabel: true,
  folderId: true,
  labels: true,
  createdAt: true,
  folder: { select: { id: true, name: true, color: true } },
} as const;

export type QrListFilterInput = {
  workspaceId: string;
  folderId?: string | null;
  label?: string | null;
  batchId?: string | null;
  batchLabel?: string | null;
  q?: string | null;
  unfiled?: boolean;
  favorites?: boolean;
  archived?: boolean;
};

export function buildQrListWhere(filters: QrListFilterInput): Prisma.QRCodeWhereInput {
  const where: Prisma.QRCodeWhereInput = { workspaceId: filters.workspaceId };

  where.isArchived = filters.archived ? true : false;
  if (filters.favorites) where.isFavorite = true;

  if (filters.unfiled) {
    where.folderId = null;
  } else if (filters.folderId) {
    where.folderId = filters.folderId;
  }

  if (filters.batchId) where.batchId = filters.batchId;
  if (filters.batchLabel) where.batchLabel = filters.batchLabel;

  const q = filters.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { targetUrl: { contains: q, mode: 'insensitive' } },
      { shortCode: { contains: q, mode: 'insensitive' } },
    ];
  }

  const label = filters.label?.trim();
  if (label) {
    const needle = label.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    where.labels = { string_contains: `"${needle}"` };
  }

  return where;
}

export async function findQrById(id: string) {
  return prisma.qRCode.findUnique({ where: { id } });
}

export async function findQrByShortCode(shortCode: string) {
  return prisma.qRCode.findUnique({ where: { shortCode } });
}

export async function findQrByShortCodeSelect<S extends Prisma.QRCodeSelect>(
  shortCode: string,
  select: S
) {
  return prisma.qRCode.findUnique({ where: { shortCode }, select });
}

export async function allocateUniqueShortCode(): Promise<string> {
  let shortCode = generateShortCode();
  while (await findQrByShortCode(shortCode)) {
    shortCode = generateShortCode();
  }
  return shortCode;
}

export async function listWorkspaceQrs(
  where: Prisma.QRCodeWhereInput,
  workspaceId: string,
  skip: number,
  take: number
) {
  const baseWhere = { workspaceId, isArchived: false };
  return Promise.all([
    prisma.qRCode.count({ where }),
    prisma.qRCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: QR_LIST_SELECT,
      skip,
      take,
    }),
    prisma.qRCode.count({ where: { ...where, isActive: true } }),
    prisma.qRCode.aggregate({ where, _sum: { totalScans: true } }),
    prisma.qRCode.count({ where: baseWhere }),
    prisma.qRCode.count({ where: { ...baseWhere, isActive: true } }),
    prisma.qRCode.aggregate({ where: baseWhere, _sum: { totalScans: true } }),
  ]);
}

export async function getWorkspaceQrListMeta(workspaceId: string) {
  return prisma.qRCode.findMany({
    where: { workspaceId },
    select: { labels: true, batchId: true, batchLabel: true },
  });
}

export async function createQr(data: Prisma.QRCodeUncheckedCreateInput) {
  return prisma.qRCode.create({ data });
}

export async function updateQr(id: string, data: Prisma.QRCodeUncheckedUpdateInput) {
  return prisma.qRCode.update({ where: { id }, data });
}

export async function deleteQr(id: string) {
  return prisma.qRCode.delete({ where: { id } });
}

export async function getShortCodesByIds(ids: string[]) {
  if (!ids.length) return [];
  return prisma.qRCode.findMany({
    where: { id: { in: ids } },
    select: { shortCode: true },
  });
}

export async function findQrsInWorkspace(ids: string[], workspaceId: string) {
  return prisma.qRCode.findMany({
    where: { workspaceId, id: { in: ids } },
    select: { id: true, labels: true },
  });
}

export async function updateManyQrs(
  updates: Array<{ id: string; data: Prisma.QRCodeUpdateInput }>
) {
  return prisma.$transaction(
    updates.map(({ id, data }) => prisma.qRCode.update({ where: { id }, data }))
  );
}
