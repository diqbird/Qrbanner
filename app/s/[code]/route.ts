export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { parseUserAgent } from '@/lib/qr-utils';
import { lookupGeo, countryName } from '@/lib/geoip';
import { isDynamicCategory } from '@/lib/qr-utils';
import { applyUtmToUrl, buildUtmForQR } from '@/lib/utm-utils';
import { resolveScheduledUrl } from '@/lib/schedule-utils';
import { getScanGeoFromRequest, resolveGeofenceUrl } from '@/lib/geofence-utils';
import { renderLandingPage, LandingPageData } from '@/lib/landing-page';
import { processScanNotifications } from '@/lib/scan-notify';
import { dispatchScanWebhooks } from '@/lib/webhooks';
import { dispatchAutomations, buildScanAutomationContext } from '@/lib/automation-engine';
import { parseAbTestData, resolveAbVariant, abCookieName } from '@/lib/ab-routing';
import { renderGpsCaptureScript } from '@/lib/gps-heatmap';
import { getVerifiedDomainByHost, isAppHost } from '@/lib/custom-domain';
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
import { parseBrandingSettings } from '@/lib/referral';
import { isBlockedRedirectUrl, SCAN_PAGE_HEADERS } from '@/lib/url-safety';
import { getQrForScan } from '@/lib/scan-redirect-cache';
import { logLandingCtaClick } from '@/lib/landing-cta-analytics';

function withScanHeaders(res: NextResponse): NextResponse {
  Object.entries(SCAN_PAGE_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

function blockedRedirectPage(): NextResponse {
  return withScanHeaders(
    htmlPage(
      'Link Blocked',
      'This destination was blocked for violating QRbanner acceptable use policy (deceptive or harmful content).',
      451
    )
  );
}

type QR = Awaited<ReturnType<typeof prisma.qRCode.findUnique>>;

const STATIC_PAYLOAD_CATEGORIES = ['vcard', 'wifi', 'event', 'email', 'sms', 'phone', 'location', 'crypto'] as const;

function htmlPage(title: string, message: string, status: number) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}div{text-align:center;padding:2rem;max-width:420px}.title{font-size:1.5rem;font-weight:700;color:#1e293b;margin-bottom:.5rem}.desc{color:#64748b;line-height:1.5}a{display:inline-block;margin-top:1rem;color:#4f46e5;text-decoration:none;font-weight:600}</style></head><body><div><p class="title">${title}</p><p class="desc">${message}</p><a href="/">Go to QRbanner</a></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html', ...SCAN_PAGE_HEADERS } }
  );
}

function passwordPage(code: string, error?: boolean) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Protected QR Code</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc}form{text-align:center;padding:2rem;max-width:380px;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.08)}.icon{width:56px;height:56px;line-height:56px;background:#4f46e5;color:#fff;border-radius:14px;font-size:26px;margin:0 auto 1rem}.title{font-size:1.25rem;font-weight:700;color:#1e293b;margin-bottom:.25rem}.desc{color:#64748b;font-size:.9rem;margin-bottom:1.25rem}input{width:100%;box-sizing:border-box;padding:.75rem 1rem;border:1px solid #e2e8f0;border-radius:10px;font-size:1rem;margin-bottom:.75rem}button{width:100%;padding:.75rem 1rem;background:#4f46e5;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer}.err{color:#dc2626;font-size:.85rem;margin-bottom:.75rem}</style></head><body><form method="POST" action="/s/${code}"><div class="icon">&#128274;</div><p class="title">Password Protected</p><p class="desc">This QR code is protected. Enter the password to continue.</p>${error ? '<p class="err">Incorrect password. Please try again.</p>' : ''}<input type="password" name="password" placeholder="Enter password" autofocus required /><button type="submit">Unlock</button></form></body></html>`,
    { status: error ? 401 : 200, headers: { 'Content-Type': 'text/html' } }
  );
}

function detectScanSource(req: NextRequest): string {
  const src = req.nextUrl.searchParams.get('src');
  if (src === 'nfc') return 'nfc';
  if (src === 'link') return 'link';
  return 'qr';
}

function logScan(
  qrCode: NonNullable<QR>,
  req: NextRequest,
  meta?: { abVariantId?: string | null }
) {
  const userAgent = req.headers.get('user-agent');
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const referer = req.headers.get('referer') ?? null;
  const headerCountry = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
  const geo = lookupGeo(ip);
  const country = geo.country ?? (headerCountry ? countryName(headerCountry) : null);
  const city = geo.city;
  const { device, browser, os } = parseUserAgent(userAgent);
  const scanSource = detectScanSource(req);
  const utm = qrCode.utmEnabled ? buildUtmForQR(qrCode) : null;

  prisma.qRScan
    .create({
      data: {
        qrCodeId: qrCode.id,
        ip,
        userAgent: userAgent ?? null,
        referer,
        device,
        browser,
        os,
        country,
        city,
        scanSource,
        abVariantId: meta?.abVariantId ?? null,
        utmSource: utm?.utm_source ?? null,
        utmMedium: utm?.utm_medium ?? null,
        utmCampaign: utm?.utm_campaign ?? null,
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    })
    .then(async () => {
      const prevTotal = qrCode.totalScans;
      await prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { totalScans: { increment: 1 } },
      });
      const newTotal = prevTotal + 1;
      const scannedAt = new Date().toISOString();
      processScanNotifications(qrCode.id, newTotal, { country, city, device, browser, os }).catch(
        (e) => console.error('Scan notification error:', e)
      );
      dispatchScanWebhooks(qrCode.userId, {
        event: 'scan',
        qr_code_id: qrCode.id,
        qr_name: qrCode.name,
        short_code: qrCode.shortCode,
        scan: { country, city, device, browser, os, scanned_at: scannedAt },
      }).catch((e) => console.error('Webhook dispatch error:', e));
      dispatchAutomations(
        buildScanAutomationContext(qrCode, {
          country,
          city,
          device,
          browser,
          os,
          scanned_at: scannedAt,
        })
      ).catch((e) => console.error('Automation dispatch error:', e));
    })
    .catch((e: unknown) => console.error('Scan logging error:', e));
}

function getRedirectUrl(
  qrCode: NonNullable<QR>,
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

function attachAbCookie(
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

function shouldShowLanding(qrCode: NonNullable<QR>): boolean {
  return Boolean(
    qrCode.landingPageEnabled &&
    isDynamicCategory(qrCode.category) &&
    qrCode.landingPageData
  );
}

function parseLandingData(raw: unknown): LandingPageData {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return { ...emptyLandingPageDefaults(), ...(raw as Partial<LandingPageData>) };
  }
  return emptyLandingPageDefaults();
}

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

async function landingPageResponse(qrCode: NonNullable<QR>, req: NextRequest): Promise<NextResponse> {
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

function resolveRedirect(qrCode: NonNullable<QR>, req: NextRequest): NextResponse {
  const { url: redirectUrl, abVariantId, abSticky } = getRedirectUrl(qrCode, req);

  if (redirectUrl && isBlockedRedirectUrl(redirectUrl)) {
    return blockedRedirectPage();
  }

  if (['vcard', 'wifi', 'event'].includes(qrCode.category)) {
    const contentType =
      qrCode.category === 'vcard'
        ? 'text/vcard'
        : qrCode.category === 'event'
          ? 'text/calendar'
          : 'text/plain';
    const fileName =
      qrCode.category === 'vcard'
        ? 'contact.vcf'
        : qrCode.category === 'event'
          ? 'event.ics'
          : 'wifi.txt';

    return withScanHeaders(
      new NextResponse(redirectUrl, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    );
  }

  const schemeCategories = ['email', 'sms', 'phone', 'location', 'crypto'] as const;
  if (
    redirectUrl &&
    schemeCategories.includes(qrCode.category as (typeof schemeCategories)[number])
  ) {
    const meta = schemePageMeta(qrCode.category, qrCode.name);
    const secondaryUrl =
      qrCode.category === 'location' ? googleMapsUrlFromGeo(redirectUrl) : undefined;
    const html = renderSchemeRedirectPage(redirectUrl, {
      ...meta,
      secondaryUrl,
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

  const pixels = getPixelConfig(qrCode);
  if (hasActivePixels(pixels) && redirectUrl) {
    const html = renderPixelRedirectPage(redirectUrl, pixels, qrCode.name, {
      shortCode: qrCode.shortCode,
      gpsHeatmapEnabled: qrCode.gpsHeatmapEnabled,
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

function runGuards(qrCode: QR): NextResponse | null {
  if (!qrCode || !qrCode.isActive) {
    return htmlPage('QR Code Not Found', 'This QR code is inactive or does not exist.', 404);
  }
  if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
    return htmlPage('QR Code Expired', 'This QR code has expired and is no longer available.', 410);
  }
  if (qrCode.scanLimit != null && qrCode.totalScans >= qrCode.scanLimit) {
    return htmlPage('Scan Limit Reached', 'This QR code has reached its maximum number of scans.', 410);
  }
  return null;
}

async function assertCustomDomainAccess(
  req: NextRequest,
  qrCode: NonNullable<QR>
): Promise<NextResponse | null> {
  const host = req.headers.get('host');
  if (isAppHost(host)) return null;

  const verified = await getVerifiedDomainByHost(host ?? '');
  if (!verified) {
    return htmlPage(
      'Domain Not Verified',
      'This custom domain is not verified yet. Complete DNS setup in your QRbanner settings.',
      404
    );
  }
  if (verified.userId !== qrCode.userId) {
    return htmlPage('QR Code Not Found', 'This QR code is not available on this domain.', 404);
  }
  return null;
}

async function handleScan(qrCode: NonNullable<QR>, req: NextRequest, skipLanding: boolean): Promise<NextResponse> {
  const isGoRedirect = req.nextUrl.searchParams.get('go') === '1';

  if (isGoRedirect || skipLanding) {
    if (isGoRedirect && shouldShowLanding(qrCode)) {
      const landing = parseLandingData(qrCode.landingPageData);
      logLandingCtaClick(qrCode, req, {
        ctaType: 'primary',
        ctaLabel: landing.ctaLabel || 'Continue',
      });
    }
    return resolveRedirect(qrCode, req);
  }

  const { abVariantId } = getRedirectUrl(qrCode, req);
  logScan(qrCode, req, { abVariantId });

  if (shouldShowLanding(qrCode)) {
    return landingPageResponse(qrCode, req);
  }

  const res = resolveRedirect(qrCode, req);
  return res;
}

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    if (shortCode === 'draft-preview') {
      return withScanHeaders(
        htmlPage(
          'Preview QR',
          'This is a design preview only. Save your QR code in QRbanner to get a live trackable link before printing or sharing.',
          200
        )
      );
    }

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!);
    if (domainGuard) return domainGuard;

    if (qrCode!.password && req.nextUrl.searchParams.get('go') !== '1') {
      return passwordPage(shortCode);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!);
    if (domainGuard) return domainGuard;

    if (!qrCode!.password) {
      return await handleScan(qrCode!, req, false);
    }

    const formData = await req.formData();
    const password = String(formData.get('password') ?? '');
    const valid = await bcrypt.compare(password, qrCode!.password);

    if (!valid) {
      return passwordPage(shortCode, true);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan POST error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
