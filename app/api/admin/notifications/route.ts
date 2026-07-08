import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { isSmtpConfigured } from '@/lib/smtp-transport';
import { sendAdminTestEmail } from '@/lib/email';
import { listEmailDeliveries } from '@/lib/email-delivery-log';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';
import { resolveEmailLocaleFromRequest } from '@/lib/i18n/resolve-email-locale';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [scanNotifyQrs, automationFlows, automationLogs, recentLogs, emailDeliveries] =
    await Promise.all([
      prisma.qRCode.count({ where: { scanNotifyEnabled: true } }),
      prisma.automationFlow.count({ where: { enabled: true } }),
      prisma.automationLog.count({ where: { createdAt: { gte: since } } }),
      prisma.automationLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 25,
        select: {
          id: true,
          trigger: true,
          success: true,
          error: true,
          createdAt: true,
          flow: { select: { name: true, user: { select: { email: true } } } },
        },
      }),
      listEmailDeliveries({ limit: 30, since }),
    ]);

  return NextResponse.json({
    smtpConfigured: isSmtpConfigured(),
    scanNotifyQrs,
    automationFlows,
    automationLogs7d: automationLogs,
    emailDeliveries7d: {
      total: emailDeliveries.total7d,
      sent: emailDeliveries.sent7d,
      failed: emailDeliveries.failed7d,
    },
    recentEmailDeliveries: emailDeliveries.items,
    recentLogs: recentLogs.map((log) => ({
      id: log.id,
      trigger: log.trigger,
      success: log.success,
      error: log.error,
      createdAt: log.createdAt,
      flowName: log.flow.name,
      ownerEmail: log.flow.user.email,
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  if (!isSmtpConfigured()) {
    return NextResponse.json({ error: 'smtp_not_configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String((body as { action?: string }).action ?? '');

  if (action !== 'test_email') {
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  }

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { email: true, brandingSettings: true },
  });
  if (!admin?.email) {
    return NextResponse.json({ error: 'admin_email_missing' }, { status: 400 });
  }

  const locale = resolveEmailLocaleFromRequest(
    req,
    (body as { locale?: string }).locale,
  );

  try {
    const result = await sendAdminTestEmail(admin.email, locale, adminId);
    if (!result.sent) {
      return NextResponse.json({ error: 'send_failed', fallback: result.fallback }, { status: 503 });
    }

    const actor = await getAdminActorContext(adminId, req);
    await recordAdminAudit({
      ...actor,
      action: 'notifications.test_email',
      targetType: 'email',
      targetId: admin.email,
      summary: 'Admin SMTP test email',
    });

    return NextResponse.json({ ok: true, sentTo: admin.email });
  } catch (error) {
    console.error('[admin/notifications] test email failed:', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
