export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { logLandingCtaClick, type LandingCtaType } from '@/lib/landing-cta-analytics';
import { findQrByShortCodeSelect } from '@/lib/repositories/qr-repository';
import { lookupGeo } from '@/lib/geoip';
import { parseUserAgent } from '@/lib/qr-utils';
import { dispatchAutomations, buildCtaAutomationContext } from '@/lib/automation-engine';
import { dispatchCtaWebhooks } from '@/lib/webhooks';
import { clientIp } from '@/lib/rate-limit';
import { enforcePublicRateLimit } from '@/lib/public-rate-limit';

const ALLOWED_TYPES = new Set<LandingCtaType>(['primary', 'hub', 'lead']);

export async function POST(req: NextRequest) {
  try {
    const limited = await enforcePublicRateLimit(req, 'landing-cta', 30, 15 * 60 * 1000);
    if (limited) return limited;

    const ip = clientIp(req);

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

    const qrCode = await findQrByShortCodeSelect(shortCode, {
      id: true,
      userId: true,
      name: true,
      shortCode: true,
      isActive: true,
      landingPageEnabled: true,
    });
    if (!qrCode?.isActive || !qrCode.landingPageEnabled) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    logLandingCtaClick(qrCode, req, { ctaType, ctaLabel });

    const geo = lookupGeo(ip);
    const { device } = parseUserAgent(req.headers.get('user-agent'));
    const clickedAt = new Date().toISOString();

    dispatchAutomations(
      buildCtaAutomationContext(qrCode, { ctaLabel, country: geo.country, device })
    ).catch((e) => console.error('[landing-cta] automation', e));

    dispatchCtaWebhooks(qrCode.userId, {
      event: 'cta_click',
      qr_code_id: qrCode.id,
      qr_name: qrCode.name,
      short_code: qrCode.shortCode,
      cta: {
        label: ctaLabel,
        country: geo.country,
        city: geo.city,
        device,
        clicked_at: clickedAt,
      },
    }).catch((e) => console.error('[landing-cta] webhook', e));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[landing-cta] POST', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
