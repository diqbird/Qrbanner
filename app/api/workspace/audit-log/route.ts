export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import { assertWorkspaceRole, getActiveWorkspaceId } from '@/lib/workspace';
import { listWorkspaceAuditLogs } from '@/lib/workspace-audit';

export async function GET(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const workspaceId =
    req.nextUrl.searchParams.get('workspaceId') ?? (await getActiveWorkspaceId(userId));
  const access = await assertWorkspaceRole(userId, workspaceId, 'admin');
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: 403 });

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '30', 10) || 30, 100);
  const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10) || 0;

  const result = await listWorkspaceAuditLogs({ workspaceId, limit, offset });
  return NextResponse.json(result);
}
