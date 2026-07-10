import { prisma } from '@/lib/db';

const MAX_DELIVERIES_PER_ENDPOINT = 50;

export type WebhookDeliveryRecord = {
  id: string;
  endpointId: string;
  event: string;
  statusCode: number | null;
  success: boolean;
  error: string | null;
  durationMs: number | null;
  attempt: number;
  createdAt: Date;
  payload?: unknown;
  endpoint?: { id: string; url: string; label: string | null };
};

export async function recordWebhookDelivery(input: {
  endpointId: string;
  userId: string;
  event: string;
  statusCode?: number | null;
  success: boolean;
  error?: string | null;
  durationMs?: number | null;
  payload?: object | null;
  attempt?: number;
}): Promise<void> {
  try {
    await prisma.webhookDelivery.create({
      data: {
        endpointId: input.endpointId,
        userId: input.userId,
        event: input.event,
        statusCode: input.statusCode ?? null,
        success: input.success,
        error: input.error ?? null,
        durationMs: input.durationMs ?? null,
        payload: input.payload ?? undefined,
        attempt: input.attempt ?? 1,
      },
    });

    const stale = await prisma.webhookDelivery.findMany({
      where: { endpointId: input.endpointId },
      orderBy: { createdAt: 'desc' },
      skip: MAX_DELIVERIES_PER_ENDPOINT,
      select: { id: true },
    });
    if (stale.length) {
      await prisma.webhookDelivery.deleteMany({
        where: { id: { in: stale.map((row) => row.id) } },
      });
    }
  } catch (err) {
    console.warn('[webhook] delivery log failed', err);
  }
}

export async function listWebhookDeliveries(
  userId: string,
  options?: { endpointId?: string; limit?: number }
): Promise<WebhookDeliveryRecord[]> {
  const limit = Math.min(options?.limit ?? 25, 100);
  return prisma.webhookDelivery.findMany({
    where: {
      userId,
      ...(options?.endpointId ? { endpointId: options.endpointId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      endpoint: { select: { id: true, url: true, label: true } },
    },
  });
}
