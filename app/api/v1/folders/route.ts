export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { serializeFolder } from '@/lib/api-serialize';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';

export async function GET(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const folders = await prisma.qRFolder.findMany({
      where: { userId: auth.userId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { qrCodes: true } } },
    });

    return apiSuccess({ data: folders.map(serializeFolder) });
  } catch (error) {
    console.error('API v1 folders list error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const name = normalizeFolderName((body.name ?? '') as string);
    if (!name) return apiError('name is required', 400);

    const existing = await prisma.qRFolder.findFirst({ where: { userId: auth.userId, name } });
    if (existing) return apiError('Folder with this name already exists', 409);

    const color = FOLDER_COLORS.includes(body.color) ? body.color : FOLDER_COLORS[0];

    const folder = await prisma.qRFolder.create({
      data: { userId: auth.userId, name, color },
      include: { _count: { select: { qrCodes: true } } },
    });

    return apiSuccess({ data: serializeFolder(folder) }, 201);
  } catch (error) {
    console.error('API v1 folder create error:', error);
    return apiError('Internal server error', 500);
  }
}
