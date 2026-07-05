import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { WorkspaceRole } from '@/lib/workspace';

export async function findActiveMember(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, status: 'active' },
  });
}

export async function findActiveMemberships(userId: string) {
  return prisma.workspaceMember.findMany({
    where: { userId, status: 'active' },
    include: { workspace: true },
    orderBy: { joinedAt: 'asc' },
  });
}

export async function findPersonalMembership(userId: string) {
  return prisma.workspaceMember.findFirst({
    where: { userId, workspace: { isPersonal: true } },
    include: { workspace: true },
  });
}

export async function getUserActiveWorkspaceId(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { activeWorkspaceId: true },
  });
}

export async function setUserActiveWorkspace(userId: string, workspaceId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { activeWorkspaceId: workspaceId },
  });
}

export async function findUserEmail(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, activeWorkspaceId: true },
  });
}

export async function createWorkspace(data: Parameters<typeof prisma.workspace.create>[0]['data']) {
  return prisma.workspace.create({ data });
}

export async function findWorkspaceById(
  workspaceId: string,
  select?: Prisma.WorkspaceSelect
) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
    ...(select ? { select } : {}),
  });
}

export async function attachLegacyQrsToWorkspace(userId: string, workspaceId: string) {
  return prisma.qRCode.updateMany({
    where: { userId, workspaceId: null },
    data: { workspaceId },
  });
}

export async function createWorkspaceMember(data: {
  workspaceId: string;
  userId: string;
  email: string;
  role: WorkspaceRole;
}) {
  return prisma.workspaceMember.create({
    data: {
      workspaceId: data.workspaceId,
      userId: data.userId,
      email: data.email,
      role: data.role,
      status: 'active',
      joinedAt: new Date(),
    },
  });
}
