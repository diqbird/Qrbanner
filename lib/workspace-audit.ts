import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

const MAX_LOGS_PER_WORKSPACE = 500;

export type WorkspaceAuditAction =
  | 'member.invite'
  | 'member.remove'
  | 'member.update_role'
  | 'sso.update'
  | 'smtp.update'
  | 'scim.update'
  | 'branding.update'
  | 'api_key.create'
  | 'api_key.revoke';

export async function recordWorkspaceAudit(input: {
  workspaceId: string;
  actorUserId?: string | null;
  action: WorkspaceAuditAction | string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.workspaceAuditLog.create({
      data: {
        workspaceId: input.workspaceId,
        actorUserId: input.actorUserId ?? null,
        action: input.action,
        meta: input.meta ? (input.meta as Prisma.InputJsonValue) : undefined,
      },
    });

    const stale = await prisma.workspaceAuditLog.findMany({
      where: { workspaceId: input.workspaceId },
      orderBy: { createdAt: 'desc' },
      skip: MAX_LOGS_PER_WORKSPACE,
      select: { id: true },
    });
    if (stale.length) {
      await prisma.workspaceAuditLog.deleteMany({
        where: { id: { in: stale.map((row) => row.id) } },
      });
    }
  } catch (err) {
    console.warn('[workspace-audit] failed to record', err);
  }
}

export async function listWorkspaceAuditLogs(options: {
  workspaceId: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const where = { workspaceId: options.workspaceId };

  const [entries, total] = await Promise.all([
    prisma.workspaceAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.workspaceAuditLog.count({ where }),
  ]);

  const actorIds = Array.from(
    new Set(entries.map((e) => e.actorUserId).filter((id): id is string => Boolean(id))),
  );
  const actors =
    actorIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
  const actorMap = new Map(actors.map((a) => [a.id, a]));

  return {
    entries: entries.map((entry) => {
      const actor = entry.actorUserId ? actorMap.get(entry.actorUserId) : null;
      return {
        id: entry.id,
        workspaceId: entry.workspaceId,
        actorUserId: entry.actorUserId,
        actorName: actor?.name ?? null,
        actorEmail: actor?.email ?? null,
        action: entry.action,
        meta: entry.meta,
        createdAt: entry.createdAt.toISOString(),
      };
    }),
    total,
    limit,
    offset,
  };
}
