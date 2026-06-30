export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import {
  getUserWorkspaces,
  getActiveWorkspaceId,
  setActiveWorkspace,
  createTeamWorkspace,
  ensurePersonalWorkspace,
} from '@/lib/workspace';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await ensurePersonalWorkspace(userId);
  const workspaces = await getUserWorkspaces(userId);
  const activeId = await getActiveWorkspaceId(userId);

  return NextResponse.json({ workspaces, activeWorkspaceId: activeId });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
