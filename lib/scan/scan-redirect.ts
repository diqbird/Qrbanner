import { NextRequest, NextResponse } from 'next/server';
import { isDynamicCategory } from '@/lib/qr-utils';
import { applyUtmToUrl } from '@/lib/utm-utils';
import { resolveScheduledUrl } from '@/lib/schedule-utils';
import { getScanGeoFromRequest, resolveGeofenceUrl } from '@/lib/geofence-utils';
import { parseAbTestData, resolveAbVariant, abCookieName } from '@/lib/ab-routing';
import {
  getAttachmentScanMeta,
  isSchemeScanCategory,
} from '@/lib/qr-category-registry';
import { isBlockedRedirectUrl } from '@/lib/url-safety';
import { resolveLanguageRedirectUrl } from '@/lib/language-redirect';
import { pickScanLocale } from '@/lib/i18n/resolve-scan-page-copy';
import {
  getPixelConfig,
  hasActivePixels,
  renderPixelRedirectPage,
} from '@/lib/pixel-analytics';
import {
  googleMapsUrlFromGeo,
  renderSchemeRedirectPage,
  schemePageMeta,
} from '@/lib/scan-redirect-page';
import { withScanHeaders, blockedRedirectPage } from '@/lib/scan/scan-html';
import type { ScanQrCode } from '@/lib/scan/scan-log';

export function getRedirectUrl(
  qrCode: ScanQrCode,
  req: NextRequest
): { url: string; abVariantId?: string; abSticky?: boolean } {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  let redirectUrl = qrCode.targetUrl;
  let abVariantId: string | undefined;
  let abSticky = false;

  if (isDynamicCategory(qrCode.category)) {
    if (qrCode.scheduleEnabled) {
      const scheduled = resolveScheduledUrl(qrCode.scheduleData, qrCode.targetUrl);
      if (scheduled) redirectUrl = scheduled;
    }

    if (qrCode.geofenceEnabled) {
      const scanGeo = getScanGeoFromRequest(req);
      const geofenced = resolveGeofenceUrl(
        qrCode.geofenceData,
        scanGeo.countryCode,
        scanGeo.city
      );
      if (geofenced) redirectUrl = geofenced;
    }

    if (qrCode.languageRedirectEnabled) {
      const langUrl = resolveLanguageRedirectUrl(
        qrCode.languageRedirectData,
        req.headers.get('accept-language')
      );
      if (langUrl) redirectUrl = langUrl;
    }

    if (qrCode.abTestEnabled) {
      const abData = parseAbTestData(qrCode.abTestData);
      const cookie = req.cookies.get(abCookieName(qrCode.shortCode))?.value;
      const resolved = resolveAbVariant(abData, cookie);
      if (resolved) {
        redirectUrl = resolved.url;
        abVariantId = resolved.variantId;
        abSticky = abData.sticky;
      }
    }

    if (isIOS && qrCode.iosUrl) redirectUrl = qrCode.iosUrl;
    else if (isAndroid && qrCode.androidUrl) redirectUrl = qrCode.androidUrl;

    if (
      redirectUrl &&
      !redirectUrl.startsWith('http') &&
      !redirectUrl.startsWith('mailto:') &&
      !redirectUrl.startsWith('tel:')
    ) {
      redirectUrl = `https://${redirectUrl}`;
    }
    redirectUrl = applyUtmToUrl(redirectUrl, qrCode);
  }

  return { url: redirectUrl, abVariantId, abSticky };
}

export function attachAbCookie(
  res: NextResponse,
  shortCode: string,
  variantId?: string,
  sticky?: boolean
): NextResponse {
  if (variantId && sticky) {
    res.cookies.set(abCookieName(shortCode), variantId, {
      maxAge: 60 * 60 * 24 * 90,
      path: '/',
      sameSite: 'lax',
    });
  }
  return res;
}

export function resolveRedirect(qrCode: ScanQrCode, req: NextRequest): NextResponse {
  const { url: redirectUrl, abVariantId, abSticky } = getRedirectUrl(qrCode, req);

  if (redirectUrl && isBlockedRedirectUrl(redirectUrl)) {
    return blockedRedirectPage(pickScanLocale(req.headers.get('accept-language')));
  }

  const attachment = getAttachmentScanMeta(qrCode.category);
  if (attachment) {
    return withScanHeaders(
      new NextResponse(redirectUrl, {
        headers: {
          'Content-Type': attachment.contentType,
          'Content-Disposition': `attachment; filename="${attachment.fileName}"`,
        },
      })
    );
  }

  if (redirectUrl && isSchemeScanCategory(qrCode.category)) {
    const locale = pickScanLocale(req.headers.get('accept-language'));
    const meta = schemePageMeta(qrCode.category, qrCode.name, locale);
    const secondaryUrl =
      qrCode.category === 'location' ? googleMapsUrlFromGeo(redirectUrl) : undefined;
    const html = renderSchemeRedirectPage(
      redirectUrl,
      {
        ...meta,
        secondaryUrl,
      },
      locale
    );
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

  const pixels = getPixelConfig(qrCode);
  if (hasActivePixels(pixels) && redirectUrl) {
    const locale = pickScanLocale(req.headers.get('accept-language'));
    const html = renderPixelRedirectPage(redirectUrl, pixels, qrCode.name, {
      shortCode: qrCode.shortCode,
      gpsHeatmapEnabled: qrCode.gpsHeatmapEnabled,
      locale,
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

  return withScanHeaders(
    attachAbCookie(
      NextResponse.redirect(redirectUrl || new URL('/', req.url).toString()),
      qrCode.shortCode,
      abVariantId,
      abSticky
    )
  );
}
