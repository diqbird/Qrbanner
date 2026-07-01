import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { parseUserAgent } from '@/lib/qr-utils';
import { lookupGeo, countryName } from '@/lib/geoip';
import type { AnalyticsRange } from '@/lib/analytics-utils';
import { buildScansByDayForRange } from '@/lib/analytics-utils';

export type LandingCtaType = 'primary' | 'hub' | 'lead';

export type LandingCtaClickRecord = {
  ctaType?: string | null;
  ctaLabel?: string | null;
  clickedAt?: Date | string | null;
  device?: string | null;
  country?: string | null;
};

export function filterCtaClicksByRange<T extends { clickedAt?: Date | string | null }>(
  clicks: T[],
  range: AnalyticsRange
): T[] {
  return clicks.filter((c) => {
    const t = new Date(c.clickedAt ?? 0).getTime();
    if (range.from && t < range.from.getTime()) return false;
    if (range.to && t > range.to.getTime()) return false;
    return true;
  });
}

export function logLandingCtaClick(
  qrCode: { id: string },
  req: NextRequest,
  meta: { ctaType: LandingCtaType; ctaLabel?: string | null }
): void {
  const userAgent = req.headers.get('user-agent');
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const headerCountry = req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry');
  const geo = lookupGeo(ip);
  const country = geo.country ?? (headerCountry ? countryName(headerCountry) : null);
  const city = geo.city;
  const { device, browser, os } = parseUserAgent(userAgent);

  prisma.landingCtaClick
    .create({
      data: {
        qrCodeId: qrCode.id,
        ctaType: meta.ctaType,
        ctaLabel: meta.ctaLabel?.trim() || null,
        ip,
        userAgent: userAgent ?? null,
        country,
        city,
        device,
        browser,
        os,
      },
    })
    .catch((err) => console.error('[landing-cta] log', err));
}

function escapeJsString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/</g, '\\u003c');
}

export function renderHubLinkBeacon(shortCode: string, label: string): string {
  const sc = escapeJsString(shortCode);
  const lb = escapeJsString(label);
  return `onclick="try{var p=JSON.stringify({shortCode:'${sc}',ctaType:'hub',ctaLabel:'${lb}'});navigator.sendBeacon&&navigator.sendBeacon('/api/landing-cta',new Blob([p],{type:'application/json'}))}catch(e){}"`;
}

export function buildLandingCtaAnalytics(
  clicks: LandingCtaClickRecord[],
  landingViews: number,
  range: AnalyticsRange,
  locale: 'en' | 'tr' = 'en'
) {
  const byType: Record<string, number> = {};
  clicks.forEach((c) => {
    const type = c.ctaType || 'primary';
    byType[type] = (byType[type] ?? 0) + 1;
  });

  const clicksByDay = buildScansByDayForRange(
    clicks.map((c) => ({ scannedAt: c.clickedAt })),
    range
  ).map(({ date, count }) => ({ date, count }));

  const totalClicks = clicks.length;
  const conversionRate =
    landingViews > 0 ? Math.round((totalClicks / landingViews) * 1000) / 10 : null;

  const typeLabels: Record<string, string> =
    locale === 'tr'
      ? { primary: 'Ana CTA', hub: 'Hub bağlantısı', lead: 'Form gönderimi' }
      : { primary: 'Primary CTA', hub: 'Hub link', lead: 'Form submit' };

  return {
    totalClicks,
    landingViews,
    conversionRate,
    clicksByType: Object.entries(byType).map(([type, count]) => ({
      name: typeLabels[type] ?? type,
      type,
      value: count,
    })),
    clicksByDay,
  };
}
