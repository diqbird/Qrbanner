import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDynamicCategory } from '@/lib/qr-utils';
import { renderLandingPage, LandingPageData } from '@/lib/landing-page';
import { getPixelConfig } from '@/lib/pixel-analytics';
import { parseBrandingSettings } from '@/lib/referral';
import { withScanHeaders } from '@/lib/scan/scan-html';
import { attachAbCookie, getRedirectUrl } from '@/lib/scan/scan-redirect';
import type { ScanQrCode } from '@/lib/scan/scan-log';

function emptyLandingPageDefaults(): LandingPageData {
  return {
    template: 'minimal',
    title: '',
    subtitle: '',
    bannerImage: '',
    accentColor: '#0071e3',
    ctaLabel: 'Continue',
  };
}

function parseLandingData(raw: unknown): LandingPageData {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return { ...emptyLandingPageDefaults(), ...(raw as Partial<LandingPageData>) };
  }
  return emptyLandingPageDefaults();
}

export function shouldShowLanding(qrCode: ScanQrCode): boolean {
  return Boolean(
    qrCode.landingPageEnabled &&
    isDynamicCategory(qrCode.category) &&
    qrCode.landingPageData
  );
}

export async function landingPageResponse(
  qrCode: ScanQrCode,
  req: NextRequest
): Promise<NextResponse> {
  const data = parseLandingData(qrCode.landingPageData);
  const { url: redirectUrl, abVariantId, abSticky } = getRedirectUrl(qrCode, req);
  const pixels = getPixelConfig(qrCode);

  const owner = await prisma.user.findUnique({
    where: { id: qrCode.userId },
    select: { plan: true, brandingSettings: true },
  });
  const branding = parseBrandingSettings(owner?.brandingSettings);
  const hidePoweredBy =
    Boolean(branding.hidePoweredBy) &&
    (owner?.plan === 'agency' || owner?.plan === 'business');

  const html = renderLandingPage(qrCode.shortCode, data, redirectUrl, {
    pixels,
    qrName: qrCode.name,
    gpsHeatmapEnabled: qrCode.gpsHeatmapEnabled,
    hidePoweredBy,
  });
  return withScanHeaders(
    attachAbCookie(
      new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }),
      qrCode.shortCode,
      abVariantId,
      abSticky
    )
  );
}

export { parseLandingData };
