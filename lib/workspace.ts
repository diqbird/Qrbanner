import crypto from 'crypto';
import { prisma } from '@/lib/db';

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

const ROLE_RANK: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function canRolePerform(role: string, minRole: WorkspaceRole): boolean {
  return (ROLE_RANK[role as WorkspaceRole] ?? 0) >= ROLE_RANK[minRole];
}

export async function ensurePersonalWorkspace(userId: string) {
  const existing = await prisma.workspaceMember.findFirst({
    where: { userId, workspace: { isPersonal: true } },
    include: { workspace: true },
  });
  if (existing) return existing.workspace;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const slug = `personal-${userId.slice(-10)}`;
  const workspace = await prisma.workspace.create({
    data: {
      name: user.name ? `${user.name}'s Workspace` : 'Personal Workspace',
      slug,
      ownerId: userId,
      isPersonal: true,
      members: {
        create: {
          userId,
          email: user.email,
          role: 'owner',
          status: 'active',
          joinedAt: new Date(),
        },
      },
    },
  });

  await prisma.qRCode.updateMany({
    where: { userId, workspaceId: null },
    data: { workspaceId: workspace.id },
  });

  if (!user.activeWorkspaceId) {
    await prisma.user.update({
      where: { id: userId },
      data: { activeWorkspaceId: workspace.id },
    });
  }

  return workspace;
}

export async function getUserWorkspaces(userId: string) {
  await ensurePersonalWorkspace(userId);
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId, status: 'active' },
    include: { workspace: true },
    orderBy: { joinedAt: 'asc' },
  });
  return memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    slug: m.workspace.slug,
    isPersonal: m.workspace.isPersonal,
    role: m.role as WorkspaceRole,
    ownerId: m.workspace.ownerId,
  }));
}

export async function getActiveWorkspaceId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeWorkspaceId: true },
  });
  if (user?.activeWorkspaceId) {
    const member = await prisma.workspaceMember.findFirst({
      where: { userId, workspaceId: user.activeWorkspaceId, status: 'active' },
    });
    if (member) return user.activeWorkspaceId;
  }
  const personal = await ensurePersonalWorkspace(userId);
  return personal.id;
}

export async function setActiveWorkspace(userId: string, workspaceId: string) {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, status: 'active' },
  });
  if (!member) throw new Error('Workspace access denied');
  await prisma.user.update({
    where: { id: userId },
    data: { activeWorkspaceId: workspaceId },
  });
}

export async function getMemberRole(
  userId: string,
  workspaceId: string
): Promise<WorkspaceRole | null> {
  const member = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, status: 'active' },
  });
  return member ? (member.role as WorkspaceRole) : null;
}

export async function assertWorkspaceRole(
  userId: string,
  workspaceId: string,
  minRole: WorkspaceRole
): Promise<{ ok: true; role: WorkspaceRole } | { ok: false; error: string }> {
  const role = await getMemberRole(userId, workspaceId);
  if (!role) return { ok: false, error: 'Workspace access denied' };
  if (!canRolePerform(role, minRole)) {
    return { ok: false, error: `Requires ${minRole} role or higher` };
  }
  return { ok: true, role };
}

export async function getWorkspaceQrWhere(userId: string, workspaceId?: string) {
  const wsId = workspaceId ?? (await getActiveWorkspaceId(userId));
  const access = await assertWorkspaceRole(userId, wsId, 'viewer');
  if (!access.ok) throw new Error(access.error);
  return { workspaceId: wsId };
}

export async function assertQrAccess(
  userId: string,
  qrId: string,
  minRole: WorkspaceRole = 'viewer'
) {
  const qr = await prisma.qRCode.findUnique({ where: { id: qrId } });
  if (!qr) return { ok: false as const, error: 'QR code not found' };

  if (qr.workspaceId) {
    const access = await assertWorkspaceRole(userId, qr.workspaceId, minRole);
    if (!access.ok) return { ok: false as const, error: access.error };
    return { ok: true as const, qr, role: access.role };
  }

  if (qr.userId !== userId) return { ok: false as const, error: 'QR code not found' };
  return { ok: true as const, qr, role: 'owner' as WorkspaceRole };
}

export function generateInviteToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export async function createTeamWorkspace(userId: string, name: string) {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) +
    '-' +
    crypto.randomBytes(3).toString('hex');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return prisma.workspace.create({
    data: {
      name,
      slug,
      ownerId: userId,
      isPersonal: false,
      members: {
        create: {
          userId,
          email: user.email,
          role: 'owner',
          status: 'active',
          joinedAt: new Date(),
        },
      },
    },
  });
}
