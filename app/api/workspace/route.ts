export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  getUserWorkspaces,
  getActiveWorkspaceId,
  setActiveWorkspace,
  createTeamWorkspace,
  ensurePersonalWorkspace,
} from '@/lib/workspace';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  await ensurePersonalWorkspace(userId);
  const workspaces = await getUserWorkspaces(userId);
  const activeId = await getActiveWorkspaceId(userId);

  return NextResponse.json({ workspaces, activeWorkspaceId: activeId });
}

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const body = await req.json();
  const action = body.action as string;

  if (action === 'switch') {
    const workspaceId = String(body.workspaceId ?? '');
    try {
      await setActiveWorkspace(userId, workspaceId);
      return NextResponse.json({ ok: true, activeWorkspaceId: workspaceId });
    } catch {
      return NextResponse.json({ error: 'Workspace access denied' }, { status: 403 });
    }
  }

  if (action === 'create') {
    const name = String(body.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    const workspace = await createTeamWorkspace(userId, name);
    await setActiveWorkspace(userId, workspace.id);
    return NextResponse.json({ workspace, activeWorkspaceId: workspace.id });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
