export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInviteToken } from '@/lib/workspace';
import { assertInviteEmailAllowed } from '@/lib/workspace-sso';
import {
  authenticateScimRequest,
  memberToScimUser,
  parseScimRole,
  scimError,
  scimJson,
} from '@/lib/scim';

export async function GET(req: NextRequest) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const startIndex = Math.max(1, parseInt(req.nextUrl.searchParams.get('startIndex') ?? '1', 10));
  const count = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get('count') ?? '100', 10)));
  const filter = req.nextUrl.searchParams.get('filter') ?? '';

  let emailFilter: string | null = null;
  const eqMatch = filter.match(/userName\s+eq\s+"([^"]+)"/i);
  if (eqMatch) emailFilter = eqMatch[1].toLowerCase();

  const where = {
    workspaceId: auth.workspaceId,
    ...(emailFilter ? { email: emailFilter } : {}),
  };

  const [total, members] = await Promise.all([
    prisma.workspaceMember.count({ where }),
    prisma.workspaceMember.findMany({
      where,
      skip: startIndex - 1,
      take: count,
      orderBy: { invitedAt: 'asc' },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return scimJson({
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    totalResults: total,
    startIndex,
    itemsPerPage: members.length,
    Resources: members.map(memberToScimUser),
  });
}

export async function POST(req: NextRequest) {
  const auth = await authenticateScimRequest(req);
  if (!auth) return scimError('Unauthorized', 401);

  const body = (await req.json()) as Record<string, unknown>;
  const email = String(body.userName ?? '').trim().toLowerCase();
  if (!email) return scimError('userName is required', 400);

  const workspace = await prisma.workspace.findUnique({
    where: { id: auth.workspaceId },
    select: { ssoEnabled: true, allowedDomains: true },
  });
  if (!workspace) return scimError('Workspace not found', 404);

  const inviteCheck = assertInviteEmailAllowed(workspace, email);
  if (!inviteCheck.ok) return scimError(inviteCheck.code, 400);

  const role = parseScimRole(body) ?? 'editor';
  const active = body.active !== false;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  const token = generateInviteToken();

  const member = await prisma.workspaceMember.upsert({
    where: { workspaceId_email: { workspaceId: auth.workspaceId, email } },
    create: {
      workspaceId: auth.workspaceId,
      email,
      role,
      status: active ? (existingUser ? 'active' : 'pending') : 'pending',
      userId: existingUser?.id ?? null,
      inviteToken: existingUser ? null : token,
      joinedAt: existingUser && active ? new Date() : null,
    },
    update: {
      role,
      status: active ? (existingUser ? 'active' : 'pending') : 'pending',
      userId: existingUser?.id ?? undefined,
      joinedAt: existingUser && active ? new Date() : undefined,
    },
    include: { user: { select: { name: true } } },
  });

  return scimJson(memberToScimUser(member), 201);
}
