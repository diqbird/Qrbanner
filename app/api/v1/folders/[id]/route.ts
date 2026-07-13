export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { serializeFolder } from '@/lib/api-serialize';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';
import { assertFolderInWorkspace, resolveApiWorkspaceId } from '@/lib/workspace';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const workspaceParam =
      req.nextUrl.searchParams.get('workspace_id') ?? req.nextUrl.searchParams.get('workspaceId');
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'viewer');
    if (!ws.ok) return apiError(ws.error, 403, auth.rateLimitHeaders);

    const access = await assertFolderInWorkspace(auth.userId, params.id, ws.workspaceId, 'viewer');
    if (!access.ok) return apiError('Folder not found', 404, auth.rateLimitHeaders);

    const folder = await prisma.qRFolder.findFirst({
      where: { id: params.id },
      include: { _count: { select: { qrCodes: true } } },
    });
    if (!folder) return apiError('Folder not found', 404, auth.rateLimitHeaders);
    return apiSuccess({ data: serializeFolder(folder) }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 folder get error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const workspaceParam =
      (body.workspace_id as string | undefined) ??
      (body.workspaceId as string | undefined) ??
      req.nextUrl.searchParams.get('workspace_id') ??
      req.nextUrl.searchParams.get('workspaceId');
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'editor');
    if (!ws.ok) return apiError(ws.error, 403);

    const access = await assertFolderInWorkspace(auth.userId, params.id, ws.workspaceId, 'editor');
    if (!access.ok) return apiError('Folder not found', 404);

    const data: { name?: string; color?: string } = {};

    if (body.name !== undefined) {
      const name = normalizeFolderName(body.name);
      if (!name) return apiError('name is required', 400);
      const dup = await prisma.qRFolder.findFirst({
        where: {
          userId: auth.userId,
          name,
          NOT: { id: params.id },
          OR: [{ workspaceId: ws.workspaceId }, { workspaceId: null }],
        },
      });
      if (dup) return apiError('Folder with this name already exists', 409);
      data.name = name;
    }

    if (body.color !== undefined && FOLDER_COLORS.includes(body.color)) {
      data.color = body.color;
    }

    const updated = await prisma.qRFolder.update({
      where: { id: params.id },
      data,
      include: { _count: { select: { qrCodes: true } } },
    });

    return apiSuccess({ data: serializeFolder(updated) }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 folder update error:', error);
    return apiError('Internal server error', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const workspaceParam =
      req.nextUrl.searchParams.get('workspace_id') ?? req.nextUrl.searchParams.get('workspaceId');
    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'editor');
    if (!ws.ok) return apiError(ws.error, 403);

    const access = await assertFolderInWorkspace(auth.userId, params.id, ws.workspaceId, 'editor');
    if (!access.ok) return apiError('Folder not found', 404);

    await prisma.qRFolder.delete({ where: { id: params.id } });
    return apiSuccess({ message: 'Folder deleted' }, 200, auth.rateLimitHeaders);
  } catch (error) {
    console.error('API v1 folder delete error:', error);
    return apiError('Internal server error', 500);
  }
}
