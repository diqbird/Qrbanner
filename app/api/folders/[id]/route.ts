export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  assertFolderInWorkspace,
  getActiveWorkspaceId,
} from '@/lib/workspace';


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const workspaceId = await getActiveWorkspaceId(userId);
    const folderAccess = await assertFolderInWorkspace(userId, params.id, workspaceId, 'editor');
    if (!folderAccess.ok) {
      return NextResponse.json({ error: folderAccess.error }, { status: 404 });
    }

    const body = await req.json();
    const data: { name?: string; color?: string } = {};

    if (body.name !== undefined) {
      const name = normalizeFolderName(body.name);
      if (!name) return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
      const dup = await prisma.qRFolder.findFirst({
        where: { userId, workspaceId, name, NOT: { id: params.id } },
      });
      if (dup) return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 409 });
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

    return NextResponse.json({
      folder: {
        id: updated.id,
        name: updated.name,
        color: updated.color,
        qrCount: updated._count.qrCodes,
      },
    });
  } catch (error) {
    console.error('Folder update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const workspaceId = await getActiveWorkspaceId(userId);
    const folderAccess = await assertFolderInWorkspace(userId, params.id, workspaceId, 'editor');
    if (!folderAccess.ok) {
      return NextResponse.json({ error: folderAccess.error }, { status: 404 });
    }

    await prisma.qRFolder.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Folder deleted' });
  } catch (error) {
    console.error('Folder delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
