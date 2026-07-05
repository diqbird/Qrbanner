export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { normalizeLabels } from '@/lib/organize-utils';
import { getActiveWorkspaceId, assertWorkspaceRole, assertFolderInWorkspace } from '@/lib/workspace';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { findQrsInWorkspace, updateManyQrs } from '@/lib/repositories/qr-repository';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const body = await req.json();
    const { qrIds, folderId, labels, mode } = body as {
      qrIds?: string[];
      folderId?: string | null;
      labels?: string[] | string;
      mode?: 'set' | 'add' | 'remove';
    };

    if (!Array.isArray(qrIds) || qrIds.length === 0) {
      return NextResponse.json({ error: 'qrIds array is required' }, { status: 400 });
    }

    if (qrIds.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 QR codes per operation' }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(userId);
    const canEdit = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!canEdit.ok) {
      return NextResponse.json({ error: canEdit.error }, { status: 403 });
    }

    const owned = await findQrsInWorkspace(qrIds, workspaceId);

    if (owned.length !== qrIds.length) {
      return NextResponse.json({ error: 'One or more QR codes not found' }, { status: 404 });
    }

    if (folderId) {
      const folderCheck = await assertFolderInWorkspace(userId, folderId, workspaceId, 'editor');
      if (!folderCheck.ok) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const labelMode = mode ?? 'set';
    const newLabels = labels !== undefined ? normalizeLabels(labels) : null;

    await updateManyQrs(
      owned.map((qr) => {
        const data: { folderId?: string | null; labels?: string[] } = {};

        if (folderId !== undefined) {
          data.folderId = folderId || null;
        }

        if (newLabels !== null) {
          const current = normalizeLabels(qr.labels);
          if (labelMode === 'add') {
            data.labels = normalizeLabels([...current, ...newLabels]);
          } else if (labelMode === 'remove') {
            const removeSet = new Set(newLabels.map((l) => l.toLowerCase()));
            data.labels = current.filter((l) => !removeSet.has(l.toLowerCase()));
          } else {
            data.labels = newLabels;
          }
        }

        return { id: qr.id, data };
      })
    );

    return NextResponse.json({ updated: owned.length });
  } catch (error) {
    console.error('QR organize error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
