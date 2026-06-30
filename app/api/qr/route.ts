export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { sanitizeGeofenceData } from '@/lib/geofence-shared';
import { assertCanCreateQr } from '@/lib/plan-usage';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';
import { normalizeGa4Id, normalizeMetaPixelId } from '@/lib/pixel-analytics';
import { sanitizeAbTestData, parseAbTestData } from '@/lib/ab-routing';
import {
  getActiveWorkspaceId,
  assertWorkspaceRole,
} from '@/lib/workspace';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

const qrListSelect = {
  id: true,
  name: true,
  shortCode: true,
  category: true,
  targetUrl: true,
  isActive: true,
  isFavorite: true,
  isArchived: true,
  totalScans: true,
  batchId: true,
  batchLabel: true,
  folderId: true,
  labels: true,
  createdAt: true,
  folder: { select: { id: true, name: true, color: true } },
} as const;

function parseLabelsField(labels: unknown): string[] {
  return normalizeLabels(labels);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = await getActiveWorkspaceId(userId);
    const where: Record<string, unknown> = { workspaceId };

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const label = searchParams.get('label');
    const batchId = searchParams.get('batchId');
    const batchLabel = searchParams.get('batchLabel');
    const q = searchParams.get('q');
    const unfiled = searchParams.get('unfiled') === '1';
    const favorites = searchParams.get('favorites') === '1';
    const archived = searchParams.get('archived') === '1';

    if (!archived) {
      where.isArchived = false;
    } else {
      where.isArchived = true;
    }
    if (favorites) where.isFavorite = true;

    if (unfiled) {
      where.folderId = null;
    } else if (folderId) {
      where.folderId = folderId;
    }

    if (batchId) where.batchId = batchId;
    if (batchLabel) where.batchLabel = batchLabel;

    if (q?.trim()) {
      where.OR = [
        { name: { contains: q.trim(), mode: 'insensitive' } },
        { targetUrl: { contains: q.trim(), mode: 'insensitive' } },
        { shortCode: { contains: q.trim(), mode: 'insensitive' } },
      ];
    }

    let qrCodes = await prisma.qRCode.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      select: qrListSelect,
    });

    if (label?.trim()) {
      const needle = label.trim().toLowerCase();
      qrCodes = qrCodes.filter((qr) =>
        parseLabelsField(qr.labels).some((l) => l.toLowerCase() === needle)
      );
    }

    const allForMeta = await prisma.qRCode.findMany({
      where: { workspaceId },
      select: { labels: true, batchId: true, batchLabel: true },
    });

    const labelSet = new Set<string>();
    const batchMap = new Map<string, string>();
    for (const qr of allForMeta) {
      parseLabelsField(qr.labels).forEach((l) => labelSet.add(l));
      if (qr.batchId && qr.batchLabel) {
        batchMap.set(qr.batchId, qr.batchLabel);
      }
    }

    return NextResponse.json({
      qrCodes: qrCodes.map((qr) => ({
        ...qr,
        labels: parseLabelsField(qr.labels),
      })),
      meta: {
        labels: Array.from(labelSet).sort((a, b) => a.localeCompare(b)),
        batches: Array.from(batchMap.entries()).map(([id, name]) => ({ id, name })),
      },
    });
  } catch (error: unknown) {
    console.error('QR list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
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
      'qr-mutation',
      QR_MUTATION_LIMIT.limit,
      QR_MUTATION_LIMIT.windowMs,
      userId
    );
    if (limited) return limited;

    const body = await req.json();
    const { name, category, qrData, style, logoPath, logoIsPublic,
            password, expiresAt, scanLimit, iosUrl, androidUrl,
            utmEnabled, utmSource, utmMedium, utmCampaign,
            landingPageEnabled, landingPageData,
            scheduleEnabled, scheduleData,
            geofenceEnabled, geofenceData,
            abTestEnabled, abTestData,
            gpsHeatmapEnabled, nfcEnabled,
            scanNotifyEnabled, scanNotifyFirst, scanNotifyMilestones, scanNotifyEvery,
            ga4Enabled, ga4MeasurementId, metaPixelEnabled, metaPixelId,
            folderId, labels } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const cleanQrData = stripMetaFields((qrData ?? {}) as Record<string, string>);
    const urlCheck = assertQrUrlsAllowed(category, cleanQrData, {
      iosUrl: iosUrl || null,
      androidUrl: androidUrl || null,
      landingPageData: landingPageData ?? null,
    });
    if (!urlCheck.ok) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400 });
    }

    const workspaceId = await getActiveWorkspaceId(userId);
    const wsAccess = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!wsAccess.ok) {
      return NextResponse.json({ error: wsAccess.error }, { status: 403 });
    }

    const planCheck = await assertCanCreateQr(userId);
    if (!planCheck.ok) {
      return NextResponse.json({ error: planCheck.error }, { status: 403 });
    }

    if (folderId) {
      const folder = await prisma.qRFolder.findFirst({ where: { id: folderId, userId } });
      if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 400 });
    }

    let shortCode = generateShortCode();
    let exists = await prisma.qRCode.findUnique({ where: { shortCode } });
    while (exists) {
      shortCode = generateShortCode();
      exists = await prisma.qRCode.findUnique({ where: { shortCode } });
    }

    const targetUrl = buildQRPayload(category, cleanQrData);
    const hashedPassword = password ? await bcrypt.hash(String(password), 10) : null;

    const qrCode = await prisma.qRCode.create({
      data: {
        userId,
        workspaceId,
        name,
        shortCode,
        category,
        targetUrl,
        qrData: cleanQrData,
        style: style ?? {},
        logoPath: logoPath ?? null,
        logoIsPublic: logoIsPublic ?? true,
        password: hashedPassword,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        scanLimit: scanLimit != null && scanLimit !== '' ? parseInt(String(scanLimit), 10) : null,
        iosUrl: iosUrl || null,
        androidUrl: androidUrl || null,
        utmEnabled: Boolean(utmEnabled),
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        landingPageEnabled: Boolean(landingPageEnabled),
        landingPageData: landingPageData ?? null,
        scheduleEnabled: Boolean(scheduleEnabled),
        scheduleData: scheduleData ?? null,
        geofenceEnabled: Boolean(geofenceEnabled),
        geofenceData: geofenceEnabled
          ? (sanitizeGeofenceData(geofenceData ?? { rules: [] }) as object)
          : undefined,
        abTestEnabled: Boolean(abTestEnabled),
        abTestData: abTestEnabled
          ? (sanitizeAbTestData(parseAbTestData(abTestData)) as object)
          : undefined,
        gpsHeatmapEnabled: Boolean(gpsHeatmapEnabled),
        nfcEnabled: Boolean(nfcEnabled),
        scanNotifyEnabled: Boolean(scanNotifyEnabled),
        scanNotifyFirst: scanNotifyFirst !== false,
        scanNotifyMilestones: scanNotifyMilestones !== false,
        scanNotifyEvery: Boolean(scanNotifyEvery),
        ga4Enabled: Boolean(ga4Enabled),
        ga4MeasurementId: ga4Enabled ? normalizeGa4Id(ga4MeasurementId) : null,
        metaPixelEnabled: Boolean(metaPixelEnabled),
        metaPixelId: metaPixelEnabled ? normalizeMetaPixelId(metaPixelId) : null,
        folderId: folderId || null,
        labels: normalizeLabels(labels ?? []),
      },
    });

    return NextResponse.json({ qrCode });
  } catch (error: unknown) {
    console.error('QR create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
