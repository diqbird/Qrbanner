export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { assertCanCreateQr, getUserPlanUsage } from '@/lib/plan-usage';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';
import { CAMPAIGN_CREATE_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { newCampaignId } from '@/lib/campaigns';
import { sanitizeCampaignPlanForCreate } from '@/lib/campaign-sanitize';
import { normalizeQRStyle } from '@/lib/qr-style';
import { emptyLandingPage } from '@/lib/landing-page';

async function uniqueShortCode(): Promise<string> {
  for (let i = 0; i < 15; i++) {
    const shortCode = generateShortCode();
    const exists = await prisma.qRCode.findUnique({ where: { shortCode }, select: { id: true } });
    if (!exists) return shortCode;
  }
  throw new Error('Could not generate short code');
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limited = await rateLimitRequest(
      req,
      'campaign-create',
      CAMPAIGN_CREATE_LIMIT.limit,
      CAMPAIGN_CREATE_LIMIT.windowMs,
      userId
    );
    if (limited) return limited;

    const workspaceId = await getActiveWorkspaceId(userId);
    const wsAccess = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!wsAccess.ok) {
      return NextResponse.json({ error: wsAccess.error }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const plan = sanitizeCampaignPlanForCreate(body.plan);
    if (!plan) {
      return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
    }

    const usage = await getUserPlanUsage(userId);
    const count = plan.items.length;
    const slotsLeft = usage.qrLimit - usage.qrCodes;
    if (count > slotsLeft) {
      return NextResponse.json(
        {
          error: `Not enough QR slots (${slotsLeft} remaining of ${usage.qrLimit}). Disable some items or upgrade.`,
        },
        { status: 403 }
      );
    }

    const batchId = newCampaignId();
    const batchLabel = plan.businessName;
    const created: { id: string; name: string; shortCode: string; category: string }[] = [];
    const errors: { name: string; message: string }[] = [];

    for (const item of plan.items) {
      const planCheck = await assertCanCreateQr(userId);
      if (!planCheck.ok) {
        errors.push({ name: item.name, message: planCheck.error });
        break;
      }

      const cleanQrData = stripMetaFields(item.qrData);
      const urlCheck = assertQrUrlsAllowed(item.category, cleanQrData, {
        landingPageData: item.landingPage ?? null,
      });
      if (!urlCheck.ok) {
        errors.push({ name: item.name, message: urlCheck.error });
        continue;
      }

      const targetUrl = buildQRPayload(item.category, cleanQrData);
      if (!targetUrl?.trim()) {
        errors.push({ name: item.name, message: 'Invalid QR content for category' });
        continue;
      }

      try {
        const shortCode = await uniqueShortCode();
        const landingPageData = item.landingEnabled && item.landingPage
          ? { ...emptyLandingPage, ...item.landingPage }
          : null;

        const qrCode = await prisma.qRCode.create({
          data: {
            userId,
            workspaceId,
            name: item.name,
            shortCode,
            category: item.category,
            targetUrl,
            qrData: cleanQrData,
            style: normalizeQRStyle(item.style ?? {}) as object,
            batchId,
            batchLabel,
            labels: normalizeLabels(['campaign', plan.industry]),
            landingPageEnabled: Boolean(item.landingEnabled && landingPageData),
            landingPageData: landingPageData ? (landingPageData as object) : undefined,
            utmEnabled: true,
            utmSource: 'qrbanner',
            utmMedium: 'qr',
            utmCampaign: batchLabel.slice(0, 80).replace(/\s+/g, '-').toLowerCase(),
          },
          select: { id: true, name: true, shortCode: true, category: true },
        });
        created.push(qrCode);
      } catch (err) {
        console.error('[campaign/create] item failed', item.name, err);
        errors.push({ name: item.name, message: 'Create failed' });
      }
    }

    if (!created.length) {
      return NextResponse.json(
        { error: 'No QR codes created', errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      campaignId: batchId,
      campaignName: batchLabel,
      created,
      errors: errors.length ? errors : undefined,
    });
  } catch (error) {
    console.error('[campaign/create]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
