export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { serializeFolder } from '@/lib/api-serialize';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';
import { listWorkspaceFolders, resolveApiWorkspaceId } from '@/lib/workspace';

export async function GET(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const workspaceParam =
      req.nextUrl.searchParams.get('workspace_id') ?? req.nextUrl.searchParams.get('workspaceId');
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'viewer');
    if (!ws.ok) return apiError(ws.error, 403, auth.rateLimitHeaders);

    const folders = await listWorkspaceFolders(auth.userId, ws.workspaceId);
    return apiSuccess({ data: folders.map(serializeFolder) }, 200, auth.rateLimitHeaders);
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

    const workspaceParam =
      (body.workspace_id as string | undefined) ?? (body.workspaceId as string | undefined);
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'editor');
    if (!ws.ok) return apiError(ws.error, 403);

    const existing = await prisma.qRFolder.findFirst({
      where: {
        userId: auth.userId,
        name,
        OR: [{ workspaceId: ws.workspaceId }, { workspaceId: null }],
      },
    });
    if (existing) return apiError('Folder with this name already exists', 409);

    const color = FOLDER_COLORS.includes(body.color) ? body.color : FOLDER_COLORS[0];

    const folder = await prisma.qRFolder.create({
      data: { userId: auth.userId, workspaceId: ws.workspaceId, name, color },
      include: { _count: { select: { qrCodes: true } } },
    });

    return apiSuccess({ data: serializeFolder(folder) }, 201, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 folder create error:', error);
    return apiError('Internal server error', 500);
  }
}
