import { NextRequest, NextResponse } from 'next/server';
import { logLandingCtaClick } from '@/lib/landing-cta-analytics';
import { logScan } from '@/lib/scan/scan-log';
import { getRedirectUrl, resolveRedirect } from '@/lib/scan/scan-redirect';
import { landingPageResponse, parseLandingData, shouldShowLanding } from '@/lib/scan/scan-landing';
import { pickScanLocale } from '@/lib/i18n/resolve-scan-page-copy';
import { resolveLandingCtaLabel } from '@/lib/i18n/resolve-landing-cta-label';
import type { ScanQrCode } from '@/lib/scan/scan-log';

export async function handleScan(
  qrCode: ScanQrCode,
  req: NextRequest,
  skipLanding: boolean
): Promise<NextResponse> {
  const isGoRedirect = req.nextUrl.searchParams.get('go') === '1';

  if (isGoRedirect || skipLanding) {
    if (isGoRedirect && shouldShowLanding(qrCode)) {
      const locale = pickScanLocale(req.headers.get('accept-language'));
      const landing = parseLandingData(qrCode.landingPageData);
      logLandingCtaClick(qrCode, req, {
        ctaType: 'primary',
        ctaLabel: resolveLandingCtaLabel(landing.ctaLabel, locale),
      });
    }
    return resolveRedirect(qrCode, req);
  }

  const { abVariantId } = getRedirectUrl(qrCode, req);
  logScan(qrCode, req, { abVariantId });

  if (shouldShowLanding(qrCode)) {
    return landingPageResponse(qrCode, req);
  }

  return resolveRedirect(qrCode, req);
}
