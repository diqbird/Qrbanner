export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

const VERIFY_LIMIT = 5;
const VERIFY_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const ip = clientIp(req);
    const limited = await checkRateLimit(
      `verify:${ip}:${normalizedEmail}`,
      VERIFY_LIMIT,
      VERIFY_WINDOW_MS
    );
    if (!limited.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'account_not_found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'already_verified', alreadyVerified: true });
    }

    if (!user.verificationCode || !user.verificationExpiry) {
      return NextResponse.json({ error: 'no_verification_code' }, { status: 400 });
    }

    if (new Date() > user.verificationExpiry) {
      return NextResponse.json({ error: 'code_expired' }, { status: 400 });
    }

    if (user.verificationCode !== String(code).trim()) {
      return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    const secret = process.env.NEXTAUTH_SECRET;
    let loginToken: string | undefined;
    if (secret) {
      loginToken = jwt.sign(
        { email: normalizedEmail, purpose: 'email-verified' },
        secret,
        { expiresIn: '5m' }
      );
    }

    return NextResponse.json({ message: 'verify_success', loginToken });
  } catch (error: unknown) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
