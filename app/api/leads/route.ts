export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseUserAgent } from '@/lib/qr-utils';
import { lookupGeo } from '@/lib/geoip';
import { logLandingCtaClick } from '@/lib/landing-cta-analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shortCode = String(body.shortCode ?? '').trim();
    if (!shortCode) {
      return NextResponse.json({ error: 'shortCode required' }, { status: 400 });
    }

    const qrCode = await prisma.qRCode.findUnique({ where: { shortCode } });
    if (!qrCode || !qrCode.isActive) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    const landing = qrCode.landingPageData as Record<string, unknown> | null;
    if (!qrCode.landingPageEnabled || !landing?.leadFormEnabled) {
      return NextResponse.json({ error: 'Lead capture not enabled' }, { status: 400 });
    }

    const email = body.email ? String(body.email).trim() : null;
    const name = body.name ? String(body.name).trim() : null;
    const phone = body.phone ? String(body.phone).trim() : null;
    const message = body.message ? String(body.message).trim() : null;

    const form = landing.leadForm as Record<string, boolean> | undefined;
    if (form?.requiredEmail && !email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!email && !name && !phone && !message) {
      return NextResponse.json({ error: 'At least one field is required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent');
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    const geo = lookupGeo(ip);
    const { device } = parseUserAgent(userAgent);

    await prisma.leadSubmission.create({
      data: {
        qrCodeId: qrCode.id,
        name,
        email,
        phone,
        message,
        country: geo.country,
        city: geo.city,
        device,
      },
    });

    logLandingCtaClick(qrCode, req, { ctaType: 'lead', ctaLabel: 'Lead form' });

    return NextResponse.json({ ok: true, redirect: `/s/${shortCode}?go=1` });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
