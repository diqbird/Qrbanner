import { sendScanNotificationEmail } from '@/lib/email';
import { prisma } from '@/lib/db';

import { SCAN_MILESTONES } from '@/lib/scan-notify-constants';

export interface ScanNotifyMeta {
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
}

function parseNotifiedMilestones(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((n): n is number => typeof n === 'number');
}

/** Fire-and-forget scan notification after totalScans incremented */
export async function processScanNotifications(
  qrCodeId: string,
  newTotal: number,
  scan: ScanNotifyMeta
): Promise<void> {
  const qr = await prisma.qRCode.findUnique({
    where: { id: qrCodeId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!qr?.scanNotifyEnabled || !qr.user?.email) return;

  const notified = parseNotifiedMilestones(qr.scanNotifiedMilestones);
  let reason: 'first' | 'milestone' | 'every' | null = null;
  let milestone: number | undefined;

  if (qr.scanNotifyEvery) {
    reason = 'every';
  } else if (newTotal === 1 && qr.scanNotifyFirst) {
    reason = 'first';
  } else if (qr.scanNotifyMilestones) {
    const hit = SCAN_MILESTONES.find((m) => newTotal === m && !notified.includes(m));
    if (hit) {
      reason = 'milestone';
      milestone = hit;
    }
  }

  if (!reason) return;

  const baseUrl = process.env.NEXTAUTH_URL || 'https://qrbanner.com';

  await sendScanNotificationEmail(qr.user.email, {
    userName: qr.user.name,
    qrName: qr.name,
    shortCode: qr.shortCode,
    qrId: qr.id,
    totalScans: newTotal,
    reason,
    milestone,
    analyticsUrl: `${baseUrl}/qr/${qr.id}/analytics`,
    country: scan.country ?? undefined,
    city: scan.city ?? undefined,
    device: scan.device ?? undefined,
    os: scan.os ?? undefined,
  });

  if (milestone) {
    await prisma.qRCode.update({
      where: { id: qrCodeId },
      data: { scanNotifiedMilestones: [...notified, milestone] },
    });
  }
}
