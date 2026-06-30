export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

const RESEND_LIMIT = 3;
const RESEND_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'email_required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const ip = clientIp(req);
    const limited = await checkRateLimit(
      `verify-resend:${ip}:${normalizedEmail}`,
      RESEND_LIMIT,
      RESEND_WINDOW_MS
    );
    if (!limited.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json({ message: 'resend_maybe_sent' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode, verificationExpiry },
    });

    await sendVerificationEmail(user.email, verificationCode, user.name);

    return NextResponse.json({ message: 'resend_success' });
  } catch (error: unknown) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
