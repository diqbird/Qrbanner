export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { sanitizeGeofenceData } from '@/lib/geofence-shared';
import { normalizeGa4Id, normalizeMetaPixelId } from '@/lib/pixel-analytics';
import { sanitizeAbTestData, parseAbTestData } from '@/lib/ab-routing';
import { assertQrAccess, assertFolderInWorkspace, getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';
import { sanitizeStoredLandingPage } from '@/lib/landing-blocks';
import { parseAnalyticsMoney } from '@/lib/analytics-roi';
import { invalidateScanQrCache } from '@/lib/scan-redirect-cache';
import { QR_MUTATION_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';
import { requireUserId, isAuthError, getSessionUserId } from '@/lib/session-auth';
import {
  allocateUniqueShortCode,
  createQr,
  updateQr,
  deleteQr,
} from '@/lib/repositories/qr-repository';

async function limitQrMutation(req: NextRequest, userId: string) {
  return rateLimitRequest(req, 'qr-mutation', QR_MUTATION_LIMIT.limit, QR_MUTATION_LIMIT.windowMs, userId);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const access = await assertQrAccess(userId, params?.id ?? '', 'viewer');
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: 404 });
    }

    const { password, ...safe } = access.qr as typeof access.qr & { password?: string | null };
    return NextResponse.json({ qrCode: { ...safe, hasPassword: Boolean(password) } });
  } catch (error: any) {
    console.error('QR get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await limitQrMutation(req, userId);
    if (limited) return limited;

    const access = await assertQrAccess(userId, params?.id ?? '', 'editor');
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: 404 });
    }
    const existing = access.qr;

    const body = await req.json();
    const { name, qrData, style, isActive, logoPath, logoIsPublic,
            password, expiresAt, scanLimit, iosUrl, androidUrl,
            utmEnabled, utmSource, utmMedium, utmCampaign,
            analyticsCampaignCost, analyticsValuePerLead,
            landingPageEnabled, landingPageData,
            scheduleEnabled, scheduleData,
            geofenceEnabled, geofenceData,
            abTestEnabled, abTestData,
            gpsHeatmapEnabled, nfcEnabled,
            scanNotifyEnabled, scanNotifyFirst, scanNotifyMilestones, scanNotifyEvery,
            ga4Enabled, ga4MeasurementId, metaPixelEnabled, metaPixelId,
            folderId, labels } = body;

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (qrData !== undefined) {
      const clean = stripMetaFields(qrData as Record<string, string>);
      const targetUrl = buildQRPayload(existing.category, clean);
      if (!targetUrl?.trim()) {
        return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
      }
      updateData.qrData = clean;
      updateData.targetUrl = targetUrl;
    }
    if (style !== undefined) updateData.style = style;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (logoPath !== undefined) updateData.logoPath = logoPath;
    if (logoIsPublic !== undefined) updateData.logoIsPublic = logoIsPublic;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (scanLimit !== undefined) updateData.scanLimit = scanLimit != null && scanLimit !== '' ? parseInt(String(scanLimit), 10) : null;
    if (iosUrl !== undefined) updateData.iosUrl = iosUrl || null;
    if (androidUrl !== undefined) updateData.androidUrl = androidUrl || null;
    if (utmEnabled !== undefined) updateData.utmEnabled = Boolean(utmEnabled);
    if (utmSource !== undefined) updateData.utmSource = utmSource || null;
    if (utmMedium !== undefined) updateData.utmMedium = utmMedium || null;
    if (utmCampaign !== undefined) updateData.utmCampaign = utmCampaign || null;
    if (analyticsCampaignCost !== undefined) {
      updateData.analyticsCampaignCost = parseAnalyticsMoney(analyticsCampaignCost);
    }
    if (analyticsValuePerLead !== undefined) {
      updateData.analyticsValuePerLead = parseAnalyticsMoney(analyticsValuePerLead);
    }
    if (landingPageEnabled !== undefined) updateData.landingPageEnabled = Boolean(landingPageEnabled);
    if (landingPageData !== undefined) {
      updateData.landingPageData = landingPageData ? sanitizeStoredLandingPage(landingPageData) : null;
    }
    if (scheduleEnabled !== undefined) updateData.scheduleEnabled = Boolean(scheduleEnabled);
    if (scheduleData !== undefined) updateData.scheduleData = scheduleData ?? null;
    if (geofenceEnabled !== undefined) updateData.geofenceEnabled = Boolean(geofenceEnabled);
    if (geofenceData !== undefined) {
      updateData.geofenceData = geofenceData
        ? (sanitizeGeofenceData(geofenceData) as object)
        : null;
    }
    if (abTestEnabled !== undefined) updateData.abTestEnabled = Boolean(abTestEnabled);
    if (abTestData !== undefined) {
      updateData.abTestData = abTestEnabled
        ? (sanitizeAbTestData(parseAbTestData(abTestData)) as object)
        : null;
    }
    if (gpsHeatmapEnabled !== undefined) updateData.gpsHeatmapEnabled = Boolean(gpsHeatmapEnabled);
    if (nfcEnabled !== undefined) updateData.nfcEnabled = Boolean(nfcEnabled);
    if (scanNotifyEnabled !== undefined) updateData.scanNotifyEnabled = Boolean(scanNotifyEnabled);
    if (scanNotifyFirst !== undefined) updateData.scanNotifyFirst = Boolean(scanNotifyFirst);
    if (scanNotifyMilestones !== undefined) updateData.scanNotifyMilestones = Boolean(scanNotifyMilestones);
    if (scanNotifyEvery !== undefined) updateData.scanNotifyEvery = Boolean(scanNotifyEvery);
    if (ga4Enabled !== undefined) {
      updateData.ga4Enabled = Boolean(ga4Enabled);
      updateData.ga4MeasurementId = ga4Enabled ? normalizeGa4Id(ga4MeasurementId) : null;
    }
    if (metaPixelEnabled !== undefined) {
      updateData.metaPixelEnabled = Boolean(metaPixelEnabled);
      updateData.metaPixelId = metaPixelEnabled ? normalizeMetaPixelId(metaPixelId) : null;
    }
    if (folderId !== undefined) {
      if (folderId) {
        const wsId = existing.workspaceId ?? (await getActiveWorkspaceId(userId));
        const folderCheck = await assertFolderInWorkspace(userId, folderId, wsId, 'editor');
        if (!folderCheck.ok) return NextResponse.json({ error: 'Folder not found' }, { status: 400 });
      }
      updateData.folderId = folderId || null;
    }
    if (labels !== undefined) updateData.labels = normalizeLabels(labels);

    const mergedQrData = (updateData.qrData ?? existing.qrData ?? {}) as Record<string, unknown>;
    const urlCheck = assertQrUrlsAllowed(existing.category, mergedQrData, {
      iosUrl: (updateData.iosUrl ?? existing.iosUrl) as string | null,
      androidUrl: (updateData.androidUrl ?? existing.androidUrl) as string | null,
      landingPageData: (updateData.landingPageData ?? existing.landingPageData) as {
        hubLinks?: { url?: string }[];
      } | null,
    });
    if (!urlCheck.ok) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400 });
    }

    // password: undefined = leave unchanged, '' or null = remove, string = set new hash
    if (password !== undefined) {
      updateData.password = password ? await bcrypt.hash(String(password), 10) : null;
    }

    const updated = await updateQr(params.id, updateData);

    await invalidateScanQrCache(existing.shortCode);

    return NextResponse.json({ qrCode: updated });
  } catch (error: any) {
    console.error('QR update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await limitQrMutation(req, userId);
    if (limited) return limited;

    const access = await assertQrAccess(userId, params?.id ?? '', 'editor');
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: 404 });
    }

    await invalidateScanQrCache(access.qr.shortCode);
    await deleteQr(params.id);

    return NextResponse.json({ message: 'QR code deleted' });
  } catch (error: any) {
    console.error('QR delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const limited = await limitQrMutation(req, userId);
    if (limited) return limited;

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'duplicate') {
      const access = await assertQrAccess(userId, params?.id ?? '', 'editor');
      if (!access.ok) {
        return NextResponse.json({ error: access.error }, { status: 404 });
      }
      const original = access.qr;

      const shortCode = await allocateUniqueShortCode();

      const duplicate = await createQr({
          userId,
          workspaceId: original.workspaceId,
          name: `${original.name} (Copy)`,
          shortCode,
          category: original.category,
          targetUrl: original.targetUrl,
          qrData: original.qrData as any,
          style: original.style as any,
          logoPath: original.logoPath,
          logoIsPublic: original.logoIsPublic,
          password: original.password,
          expiresAt: original.expiresAt,
          scanLimit: original.scanLimit,
          iosUrl: original.iosUrl,
          androidUrl: original.androidUrl,
          utmEnabled: original.utmEnabled,
          utmSource: original.utmSource,
          utmMedium: original.utmMedium,
          utmCampaign: original.utmCampaign,
          landingPageEnabled: original.landingPageEnabled,
          landingPageData: original.landingPageData ?? undefined,
          scheduleEnabled: original.scheduleEnabled,
          scheduleData: original.scheduleData ?? undefined,
          geofenceEnabled: original.geofenceEnabled,
          geofenceData: original.geofenceData ?? undefined,
          abTestEnabled: original.abTestEnabled,
          abTestData: original.abTestData ?? undefined,
          gpsHeatmapEnabled: original.gpsHeatmapEnabled,
          nfcEnabled: original.nfcEnabled,
          scanNotifyEnabled: original.scanNotifyEnabled,
          scanNotifyFirst: original.scanNotifyFirst,
          scanNotifyMilestones: original.scanNotifyMilestones,
          scanNotifyEvery: original.scanNotifyEvery,
          scanNotifiedMilestones: original.scanNotifiedMilestones ?? undefined,
          folderId: original.folderId,
          labels: original.labels ?? [],
          ga4Enabled: original.ga4Enabled,
          ga4MeasurementId: original.ga4MeasurementId,
          metaPixelEnabled: original.metaPixelEnabled,
          metaPixelId: original.metaPixelId,
      });

      return NextResponse.json({ qrCode: duplicate });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('QR action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
