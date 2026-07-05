import crypto from 'crypto';
import { prisma } from '@/lib/db';
import {
  findActiveMember,
  findActiveMemberships,
  findPersonalMembership,
  getUserActiveWorkspaceId,
  setUserActiveWorkspace,
  findUserEmail,
  createWorkspace,
  findWorkspaceById,
  attachLegacyQrsToWorkspace,
} from '@/lib/repositories/workspace-repository';
import { findQrById } from '@/lib/repositories/qr-repository';

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
  const existing = await findPersonalMembership(userId);
  if (existing) return existing.workspace;

  const user = await findUserEmail(userId);
  if (!user?.email) throw new Error('User not found');

  const slug = `personal-${userId.slice(-10)}`;
  const workspace = await createWorkspace({
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
  });

  await attachLegacyQrsToWorkspace(userId, workspace.id);

  if (!user.activeWorkspaceId) {
    await setUserActiveWorkspace(userId, workspace.id);
  }

  return workspace;
}

export async function getUserWorkspaces(userId: string) {
  await ensurePersonalWorkspace(userId);
  const memberships = await findActiveMemberships(userId);
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
  const user = await getUserActiveWorkspaceId(userId);
  if (user?.activeWorkspaceId) {
    const member = await findActiveMember(userId, user.activeWorkspaceId);
    if (member) return user.activeWorkspaceId;
  }
  const personal = await ensurePersonalWorkspace(userId);
  return personal.id;
}

export async function setActiveWorkspace(userId: string, workspaceId: string) {
  const member = await findActiveMember(userId, workspaceId);
  if (!member) throw new Error('Workspace access denied');
  await setUserActiveWorkspace(userId, workspaceId);
}

export async function getMemberRole(
  userId: string,
  workspaceId: string
): Promise<WorkspaceRole | null> {
  const member = await findActiveMember(userId, workspaceId);
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
  const qr = await findQrById(qrId);
  if (!qr) return { ok: false as const, error: 'QR code not found' };

  if (qr.workspaceId) {
    const access = await assertWorkspaceRole(userId, qr.workspaceId, minRole);
    if (!access.ok) return { ok: false as const, error: access.error };
    return { ok: true as const, qr, role: access.role };
  }

  if (qr.userId !== userId) return { ok: false as const, error: 'QR code not found' };
  return { ok: true as const, qr, role: 'owner' as WorkspaceRole };
}

export async function resolveApiWorkspaceId(
  userId: string,
  workspaceIdParam?: string | null,
  minRole: WorkspaceRole = 'viewer'
): Promise<{ ok: true; workspaceId: string } | { ok: false; error: string }> {
  const workspaceId = workspaceIdParam?.trim() || (await getActiveWorkspaceId(userId));
  const access = await assertWorkspaceRole(userId, workspaceId, minRole);
  if (!access.ok) return { ok: false, error: access.error };
  return { ok: true, workspaceId };
}

async function folderScopeForWorkspace(userId: string, workspaceId: string) {
  const workspace = await findWorkspaceById(workspaceId, { isPersonal: true });
  if (workspace?.isPersonal) {
    return {
      OR: [{ workspaceId }, { workspaceId: null, userId }],
    };
  }
  return { workspaceId };
}

/** List folders visible in the active workspace (team-shared or personal legacy). */
export async function listWorkspaceFolders(userId: string, workspaceId: string) {
  const access = await assertWorkspaceRole(userId, workspaceId, 'viewer');
  if (!access.ok) throw new Error(access.error);

  const scope = await folderScopeForWorkspace(userId, workspaceId);
  return prisma.qRFolder.findMany({
    where: scope,
    orderBy: { name: 'asc' },
    include: { _count: { select: { qrCodes: true } } },
  });
}

export async function assertFolderInWorkspace(
  userId: string,
  folderId: string,
  workspaceId: string,
  minRole: WorkspaceRole = 'editor'
): Promise<{ ok: true; folder: { id: string; name: string } } | { ok: false; error: string }> {
  const access = await assertWorkspaceRole(userId, workspaceId, minRole);
  if (!access.ok) return { ok: false, error: access.error };

  const scope = await folderScopeForWorkspace(userId, workspaceId);
  const folder = await prisma.qRFolder.findFirst({
    where: { id: folderId, ...scope },
    select: { id: true, name: true },
  });
  if (!folder) return { ok: false, error: 'Folder not found' };
  return { ok: true, folder };
}

/** SSO metadata safe for workspace members list — certificate only for owners. */
export function workspaceSummaryForRole(
  workspace: {
    id: string;
    name: string;
    slug: string;
    isPersonal: boolean;
    ssoEnabled: boolean;
    ssoProvider: string | null;
    allowedDomains: unknown;
    idpEntityId?: string | null;
    idpSsoUrl?: string | null;
    idpCertificate?: string | null;
  },
  role: WorkspaceRole
) {
  const base = {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    isPersonal: workspace.isPersonal,
    ssoEnabled: workspace.ssoEnabled,
    ssoProvider: workspace.ssoProvider,
    allowedDomains: workspace.allowedDomains,
  };
  if (role === 'viewer' || role === 'editor') return base;
  if (role === 'admin') {
    return {
      ...base,
      idpEntityId: workspace.idpEntityId ?? null,
      idpSsoUrl: workspace.idpSsoUrl ?? null,
    };
  }
  return {
    ...base,
    idpEntityId: workspace.idpEntityId ?? null,
    idpSsoUrl: workspace.idpSsoUrl ?? null,
    idpCertificate: workspace.idpCertificate ?? null,
  };
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

  const user = await findUserEmail(userId);
  if (!user?.email) throw new Error('User not found');

  return createWorkspace({
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
  });
}
