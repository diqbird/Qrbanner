export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import {
  authenticateScimRequest,
  memberToScimUser,
  parseScimPatchActive,
  parseScimRole,
  scimError,
  scimJson,
} from '@/lib/scim';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id } = await params;
  const member = await prisma.workspaceMember.findFirst({
    where: { id, workspaceId: auth.workspaceId },
    include: { user: { select: { name: true } } },
  });
  if (!member) return scimError('User not found', 404);
  return scimJson(memberToScimUser(member));
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id } = await params;
  const member = await prisma.workspaceMember.findFirst({
    where: { id, workspaceId: auth.workspaceId },
  });
  if (!member) return scimError('User not found', 404);
  if (member.role === 'owner') return scimError('Cannot modify workspace owner', 400);

  const body = (await req.json()) as Record<string, unknown>;
  const data: { role?: string; status?: string; email?: string; joinedAt?: Date | null } = {};

  if (body.userName !== undefined) {
    data.email = String(body.userName).trim().toLowerCase();
  }
  const role = parseScimRole(body);
  if (role) data.role = role;

  if (body.active === false) {
    await prisma.workspaceMember.delete({ where: { id } });
    return new Response(null, { status: 204 });
  }

  const patchActive = parseScimPatchActive(body.Operations);
  if (patchActive === false) {
    await prisma.workspaceMember.delete({ where: { id } });
    return new Response(null, { status: 204 });
  }

  if (patchActive === true || body.active === true) {
    const user = await prisma.user.findUnique({ where: { email: member.email } });
    data.status = 'active';
    if (user) {
      data.joinedAt = new Date();
      await prisma.workspaceMember.update({
        where: { id },
        data: { ...data, userId: user.id },
      });
    } else {
      await prisma.workspaceMember.update({ where: { id }, data });
    }
  } else if (Object.keys(data).length) {
    await prisma.workspaceMember.update({ where: { id }, data });
  }

  const updated = await prisma.workspaceMember.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  if (!updated) return scimError('User not found', 404);
  return scimJson(memberToScimUser(updated));
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const { id } = await params;
  const member = await prisma.workspaceMember.findFirst({
    where: { id, workspaceId: auth.workspaceId },
  });
  if (!member) return scimError('User not found', 404);
  if (member.role === 'owner') return scimError('Cannot delete workspace owner', 400);

  await prisma.workspaceMember.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

export async function PUT(req: NextRequest, ctx: RouteParams) {
  return PATCH(req, ctx);
}
