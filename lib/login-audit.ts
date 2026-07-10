import { prisma } from '@/lib/db';

const MAX_LOGS = 5000;

export type LoginAuditOutcome = 'success' | 'failure' | 'blocked';

export async function recordLoginAudit(input: {
  email: string;
  userId?: string | null;
  provider: string;
  outcome: LoginAuditOutcome;
  reason?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await prisma.loginAuditLog.create({
      data: {
        email: input.email.toLowerCase().slice(0, 320),
        userId: input.userId ?? null,
        provider: input.provider.slice(0, 64),
        outcome: input.outcome,
        reason: input.reason?.slice(0, 240) ?? null,
        ipAddress: input.ipAddress?.slice(0, 64) ?? null,
        userAgent: input.userAgent?.slice(0, 240) ?? null,
      },
    });

    const stale = await prisma.loginAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: MAX_LOGS,
      select: { id: true },
    });
    if (stale.length) {
      await prisma.loginAuditLog.deleteMany({
        where: { id: { in: stale.map((row) => row.id) } },
      });
    }
  } catch (err) {
    console.warn('[login-audit] failed to record', err);
  }
}

export async function listLoginAuditLogs(options: {
  limit?: number;
  offset?: number;
  outcome?: string;
}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const where = options.outcome ? { outcome: options.outcome } : {};

  const [entries, total] = await Promise.all([
    prisma.loginAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.loginAuditLog.count({ where }),
  ]);

  return { entries, total, limit, offset };
}
