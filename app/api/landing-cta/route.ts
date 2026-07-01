export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logLandingCtaClick, type LandingCtaType } from '@/lib/landing-cta-analytics';

const ALLOWED_TYPES = new Set<LandingCtaType>(['primary', 'hub', 'lead']);

export async function POST(req: NextRequest) {
  try {
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
      select: { id: true, isActive: true, landingPageEnabled: true },
    });
    if (!qrCode?.isActive || !qrCode.landingPageEnabled) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    logLandingCtaClick(qrCode, req, { ctaType, ctaLabel });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[landing-cta] POST', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
