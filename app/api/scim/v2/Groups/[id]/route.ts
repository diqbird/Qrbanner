export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateScimRequest,
  isScimRoleGroupId,
  loadRoleGroupMembers,
  parseScimGroupMemberOps,
  roleGroupToScim,
  scimError,
  scimJson,
} from '@/lib/scim';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id: rawId } = await params;
  const id = rawId.trim().toLowerCase();
  if (!isScimRoleGroupId(id)) return scimError('Group not found', 404);

  const members = await loadRoleGroupMembers(auth.workspaceId, id);
  return scimJson(roleGroupToScim(id, members));
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id: rawId } = await params;
  const id = rawId.trim().toLowerCase();
  if (!isScimRoleGroupId(id)) return scimError('Group not found', 404);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ops = parseScimGroupMemberOps(body.Operations);

  const applyRole = async (memberIds: string[], role: string) => {
    for (const memberId of memberIds) {
      const member = await prisma.workspaceMember.findFirst({
        where: { id: memberId, workspaceId: auth.workspaceId },
        select: { id: true, role: true },
      });
      if (!member) continue;
      if (member.role === 'owner') continue;
      await prisma.workspaceMember.update({
        where: { id: member.id },
        data: { role },
      });
    }
  };

  if (ops.replace) {
    const current = await loadRoleGroupMembers(auth.workspaceId, id);
    const keep = new Set(ops.replace);
    const toDemote = current.filter((m) => !keep.has(m.id)).map((m) => m.id);
    await applyRole(ops.replace, id);
    await applyRole(toDemote, 'viewer');
  } else {
    if (ops.add.length) await applyRole(ops.add, id);
    if (ops.remove.length) await applyRole(ops.remove, 'viewer');
  }

  // Also accept POST-style members on a non-Operations body (some IdPs)
  if (!body.Operations && Array.isArray(body.members)) {
    const ids = body.members
      .map((m) => {
        if (typeof m === 'string') return m;
        if (m && typeof m === 'object' && 'value' in m) return String((m as { value?: unknown }).value ?? '');
        return '';
      })
      .map((s) => s.trim())
      .filter(Boolean);
    const current = await loadRoleGroupMembers(auth.workspaceId, id);
    const keep = new Set(ids);
    const toDemote = current.filter((m) => !keep.has(m.id)).map((m) => m.id);
    await applyRole(ids, id);
    await applyRole(toDemote, 'viewer');
  }

  const members = await loadRoleGroupMembers(auth.workspaceId, id);
  return scimJson(roleGroupToScim(id, members));
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id: rawId } = await params;
  const id = rawId.trim().toLowerCase();
  if (!isScimRoleGroupId(id)) return scimError('Group not found', 404);
  return scimError('Virtual role groups cannot be deleted', 400);
}

export async function PUT(req: NextRequest, ctx: RouteParams) {
  return PATCH(req, ctx);
}
