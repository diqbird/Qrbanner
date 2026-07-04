import { prisma } from '@/lib/db';

export async function claimBillingWebhookEvent(
  provider: 'stripe' | 'paddle',
  eventId: string
): Promise<boolean> {
  const id = `${provider}:${eventId}`;
  try {
    await prisma.billingWebhookEvent.create({
      data: { id, provider, eventId },
    });
    return true;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2002') return false;
    throw error;
  }
}

/** Allow provider retries after a failed handler (claim is released). */
export async function releaseBillingWebhookEvent(
  provider: 'stripe' | 'paddle',
  eventId: string
): Promise<void> {
  const id = `${provider}:${eventId}`;
  await prisma.billingWebhookEvent.deleteMany({ where: { id } });
}