import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { clientIp } from '@/lib/rate-limit-store';

const MAX_LOGS = 1000;

export type AdminAuditAction =
  | 'user.plan_update'
  | 'user.role_update'
  | 'site_settings.update'
  | 'blog.create'
  | 'blog.update'
  | 'blog.delete'
  | 'banners.announcement_update'
  | 'support.inquiry_status'
  | 'notifications.test_email'
  | 'studio.entitlement_create'
  | 'studio.entitlement_revoke'
  | 'studio.etsy_register'
  | 'studio.etsy_approve_send';

export async function recordAdminAudit(input: {
  actorId: string;
  actorEmail?: string | null;
  action: AdminAuditAction;
  targetType?: string;
  targetId?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  req?: NextRequest;
}): Promise<void> {
  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: input.actorId,
        actorEmail: input.actorEmail ?? null,
        action: input.action,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        summary: input.summary ?? null,
        metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
        ipAddress: input.req ? clientIp(input.req) : null,
        userAgent: input.req?.headers.get('user-agent')?.slice(0, 240) ?? null,
      },
    });

    const stale = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: MAX_LOGS,
      select: { id: true },
    });
    if (stale.length) {
      await prisma.adminAuditLog.deleteMany({
        where: { id: { in: stale.map((row) => row.id) } },
      });
    }
  } catch (err) {
    console.warn('[admin-audit] failed to record', err);
  }
}

export async function getAdminActorContext(adminId: string, req?: NextRequest) {
  const user = await prisma.user.findUnique({
    where: { id: adminId },
    select: { email: true },
  });
  return {
    actorId: adminId,
    actorEmail: user?.email ?? null,
    req,
  };
}

export async function listAdminAuditLogs(options?: {
  limit?: number;
  offset?: number;
  action?: string;
}) {
  const limit = Math.min(options?.limit ?? 50, 100);
  const offset = options?.offset ?? 0;
  const where = options?.action ? { action: options.action } : undefined;

  const [entries, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.adminAuditLog.count({ where }),
  ]);

  return {
    entries: entries.map((entry) => ({
      id: entry.id,
      actorId: entry.actorId,
      actorEmail: entry.actorEmail,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      summary: entry.summary,
      metadata: entry.metadata,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: entry.createdAt.toISOString(),
    })),
    total,
    limit,
    offset,
  };
}
