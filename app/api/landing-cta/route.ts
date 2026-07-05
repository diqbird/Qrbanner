export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logLandingCtaClick, type LandingCtaType } from '@/lib/landing-cta-analytics';
import { lookupGeo } from '@/lib/geoip';
import { parseUserAgent } from '@/lib/qr-utils';
import { dispatchAutomations, buildCtaAutomationContext } from '@/lib/automation-engine';
import { checkRateLimit } from '@/lib/rate-limit';

const ALLOWED_TYPES = new Set<LandingCtaType>(['primary', 'hub', 'lead']);

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    const limited = await checkRateLimit(`landing-cta:${ip}`, 30, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const shortCode = String(body.shortCode ?? '').trim();
    const ctaType = String(body.ctaType ?? 'hub') as LandingCtaType;
    const ctaLabel = body.ctaLabel ? String(body.ctaLabel).trim() : null;

    if (!shortCode) {
      return NextResponse.json({ error: 'shortCode required' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(ctaType) || ctaType === 'primary') {
      return NextResponse.json({ error: 'invalid ctaType' }, { status: 400 });
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { shortCode },
      select: { id: true, userId: true, name: true, shortCode: true, isActive: true, landingPageEnabled: true },
    });
    if (!qrCode?.isActive || !qrCode.landingPageEnabled) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    logLandingCtaClick(qrCode, req, { ctaType, ctaLabel });

    const geo = lookupGeo(ip);
    const { device } = parseUserAgent(req.headers.get('user-agent'));

    dispatchAutomations(
      buildCtaAutomationContext(qrCode, { ctaLabel, country: geo.country, device })
    ).catch((e) => console.error('[landing-cta] automation', e));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[landing-cta] POST', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
