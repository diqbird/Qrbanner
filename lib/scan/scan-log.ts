import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseUserAgent } from '@/lib/qr-utils';
import { lookupGeo, countryName } from '@/lib/geoip';
import { buildUtmForQR } from '@/lib/utm-utils';
import { processScanNotifications } from '@/lib/scan-notify';
import { dispatchScanWebhooks } from '@/lib/webhooks';
import { dispatchAutomations, buildScanAutomationContext } from '@/lib/automation-engine';

export type ScanQrCode = NonNullable<Awaited<ReturnType<typeof prisma.qRCode.findUnique>>>;

function detectScanSource(req: NextRequest): string {
  const src = req.nextUrl.searchParams.get('src');
  if (src === 'nfc') return 'nfc';
  if (src === 'link') return 'link';
  return 'qr';
}

export function logScan(
  qrCode: ScanQrCode,
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
