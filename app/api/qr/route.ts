export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { sanitizeGeofenceData } from '@/lib/geofence-shared';
import { assertCanCreateQr } from '@/lib/plan-usage';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';
import { sanitizeStoredLandingPage } from '@/lib/landing-blocks';
import { normalizeGa4Id, normalizeMetaPixelId } from '@/lib/pixel-analytics';
import { sanitizeAbTestData, parseAbTestData } from '@/lib/ab-routing';
import { requireUserId, isAuthError, getSessionUserId } from '@/lib/session-auth';
import {
  getActiveWorkspaceId,
  assertWorkspaceRole,
  assertFolderInWorkspace,
} from '@/lib/workspace';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { parseQrListPagination } from '@/lib/qr-list-pagination';
import {
  buildQrListWhere,
  listWorkspaceQrs,
  getWorkspaceQrListMeta,
  allocateUniqueShortCode,
  createQr,
} from '@/lib/repositories/qr-repository';

function parseLabelsField(labels: unknown): string[] {
  return normalizeLabels(labels);
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const workspaceId = await getActiveWorkspaceId(userId);
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const label = searchParams.get('label');
    const batchId = searchParams.get('batchId');
    const batchLabel = searchParams.get('batchLabel');
    const q = searchParams.get('q');
    const unfiled = searchParams.get('unfiled') === '1';
    const favorites = searchParams.get('favorites') === '1';
    const archived = searchParams.get('archived') === '1';

    const where = buildQrListWhere({
      workspaceId,
      folderId,
      label,
      batchId,
      batchLabel,
      q,
      unfiled,
      favorites,
      archived,
    });

    const { page, limit, skip } = parseQrListPagination(searchParams);

    const [
      total,
      qrCodes,
      activeCount,
      scanSum,
      accountTotal,
      accountActive,
      accountScanSum,
    ] = await listWorkspaceQrs(where, workspaceId, skip, limit);

    const allForMeta = await getWorkspaceQrListMeta(workspaceId);

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
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      totals: {
        accountQrCount: accountTotal,
        accountActiveCount: accountActive,
        accountTotalScans: accountScanSum._sum.totalScans ?? 0,
        filteredTotal: total,
        filteredScans: scanSum._sum.totalScans ?? 0,
        filteredActive: activeCount,
      },
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
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

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

    const cleanLandingPage = landingPageData ? sanitizeStoredLandingPage(landingPageData) : null;

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
      const folderCheck = await assertFolderInWorkspace(userId, folderId, workspaceId, 'editor');
      if (!folderCheck.ok) return NextResponse.json({ error: 'Folder not found' }, { status: 400 });
    }

    const shortCode = await allocateUniqueShortCode();

    const targetUrl = buildQRPayload(category, cleanQrData);
    if (!targetUrl?.trim()) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }
    const hashedPassword = password ? await bcrypt.hash(String(password), 10) : null;

    const qrCode = await createQr({
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
        landingPageData: cleanLandingPage,
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
    });

    return NextResponse.json({ qrCode });
  } catch (error: unknown) {
    console.error('QR create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
