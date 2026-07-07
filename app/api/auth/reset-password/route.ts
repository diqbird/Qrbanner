export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validatePassword } from '@/lib/password';
import { hashPasswordResetCode, hashUserPassword } from '@/lib/password-reset';
import { clientIp } from '@/lib/rate-limit';
import { enforceRateLimit } from '@/lib/authenticated-rate-limit';
import {
  AUTH_RESET_PASSWORD_EMAIL,
  AUTH_RESET_PASSWORD_IP,
} from '@/lib/rate-limit-policies';

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const ipLimited = await enforceRateLimit(
      AUTH_RESET_PASSWORD_IP.key(ip),
      AUTH_RESET_PASSWORD_IP.limit,
      AUTH_RESET_PASSWORD_IP.windowMs
    );
    if (ipLimited) return ipLimited;

    const { email, code, password } = await req.json();
    if (!email || !code || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedCode = String(code).replace(/\D/g, '').trim();
    if (normalizedCode.length !== 6) {
      return NextResponse.json({ error: 'invalid_reset_code' }, { status: 400 });
    }

    const emailLimited = await enforceRateLimit(
      AUTH_RESET_PASSWORD_EMAIL.key(normalizedEmail),
      AUTH_RESET_PASSWORD_EMAIL.limit,
      AUTH_RESET_PASSWORD_EMAIL.windowMs
    );
    if (emailLimited) return emailLimited;

    const check = validatePassword(password);
    if (!check.ok) {
      return NextResponse.json({ error: check.code }, { status: 400 });
    }

    const codeHash = hashPasswordResetCode(normalizedEmail, normalizedCode);

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        passwordResetToken: codeHash,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'invalid_reset_code' }, { status: 400 });
    }

    const hashedPassword = await hashUserPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        sessionVersion: { increment: 1 },
        // Entering the emailed reset code proves mailbox ownership, so treat
        // the account as verified. Without this, users who never verified can
        // reset their password but still get blocked at login by the
        // email-verification gate.
        ...(user.emailVerified ? {} : { emailVerified: new Date() }),
      },
    });

    return NextResponse.json({ message: 'password_updated' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
