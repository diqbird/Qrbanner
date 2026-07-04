export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { getPlanLimits } from '@/lib/plans';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getUserPlanUsage(userId);

    const [webhooks, automations, styleTemplates] = await Promise.all([
      prisma.webhookEndpoint.count({ where: { userId } }),
      prisma.automationFlow.count({ where: { userId } }),
      prisma.qRStyleTemplate.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      plan: usage.plan,
      usage: {
        qrCodes: usage.qrCodes,
        qrLimit: usage.qrLimit,
        customDomains: usage.customDomains,
        domainLimit: usage.domainLimit,
        bulkRowLimit: usage.plan.maxBulkRows,
        webhooks,
        webhookLimit: usage.plan.maxWebhooks,
        automations,
        automationLimit: usage.plan.maxAutomations,
        styleTemplates,
        styleTemplateLimit: usage.plan.maxStyleTemplates,
      },
      launchBanner: getLaunchBanner('en'),
    });
  } catch (error) {
    console.error('Account usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
