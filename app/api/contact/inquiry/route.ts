export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { clientIp } from '@/lib/rate-limit';
import { enforcePublicRateLimit } from '@/lib/public-rate-limit';
import { sendSalesInquiryEmail } from '@/lib/sales-inquiry-email';
import { guardPublicPost } from '@/lib/guard-public-post';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const limited = await enforcePublicRateLimit(req, 'contact', 5, 15 * 60 * 1000);
    if (limited) return limited;

    const ip = clientIp(req);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }

    const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const blocked = await guardPublicPost(req, record, ip);
    if (blocked) return blocked;

    const type = record.type === 'enterprise' || record.type === 'demo' ? record.type : 'general';
    const name = String(record.name ?? '').trim();
    const email = String(record.email ?? '').trim().toLowerCase();
    const company = String(record.company ?? '').trim();
    const phone = String(record.phone ?? '').trim();
    const message = String(record.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'message_too_long' }, { status: 400 });
    }

    const delivery = await sendSalesInquiryEmail({
      type,
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      message,
    });

    return NextResponse.json({ ok: true, delivered: delivery.sent });
  } catch (error) {
    console.error('[contact/inquiry]', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
