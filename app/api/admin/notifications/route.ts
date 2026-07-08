export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { isSmtpConfigured } from '@/lib/smtp-transport';

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [scanNotifyQrs, automationFlows, automationLogs, recentLogs] = await Promise.all([
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
  ]);

  return NextResponse.json({
    smtpConfigured: isSmtpConfigured(),
    scanNotifyQrs,
    automationFlows,
    automationLogs7d: automationLogs,
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
