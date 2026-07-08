import { prisma } from '@/lib/db';

const MAX_LOGS = 500;

export type EmailDeliveryKind =
  | 'admin_test'
  | 'verification'
  | 'password_reset'
  | 'password_reset_oauth'
  | 'team_invite'
  | 'scan_notify'
  | 'automation'
  | 'sales_inquiry'
  | 'transactional';

export async function recordEmailDelivery(input: {
  kind: EmailDeliveryKind;
  to: string;
  subject: string;
  success: boolean;
  error?: string | null;
  actorId?: string | null;
}): Promise<void> {
  try {
    await prisma.emailDeliveryLog.create({
      data: {
        kind: input.kind,
        to: input.to,
        subject: input.subject.slice(0, 240),
        success: input.success,
        error: input.error?.slice(0, 500) ?? null,
        actorId: input.actorId ?? null,
      },
    });

    const stale = await prisma.emailDeliveryLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip: MAX_LOGS,
      select: { id: true },
    });
    if (stale.length) {
      await prisma.emailDeliveryLog.deleteMany({
        where: { id: { in: stale.map((row: { id: string }) => row.id) } },
      });
    }
  } catch (err) {
    console.warn('[email-delivery-log] failed to record', err);
  }
}

export async function listEmailDeliveries(options?: { limit?: number; since?: Date }) {
  const limit = Math.min(options?.limit ?? 30, 100);
  const where = options?.since ? { createdAt: { gte: options.since } } : undefined;

  const [items, total7d, sent7d, failed7d] = await Promise.all([
    prisma.emailDeliveryLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        kind: true,
        to: true,
        subject: true,
        success: true,
        error: true,
        createdAt: true,
      },
    }),
    prisma.emailDeliveryLog.count({
      where: { createdAt: { gte: options?.since ?? new Date(0) } },
    }),
    prisma.emailDeliveryLog.count({
      where: { createdAt: { gte: options?.since ?? new Date(0) }, success: true },
    }),
    prisma.emailDeliveryLog.count({
      where: { createdAt: { gte: options?.since ?? new Date(0) }, success: false },
    }),
  ]);

  return { items, total7d, sent7d, failed7d };
}
