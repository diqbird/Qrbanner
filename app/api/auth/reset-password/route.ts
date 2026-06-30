export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { validatePassword } from '@/lib/password';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const check = validatePassword(password);
    if (!check.ok) {
      return NextResponse.json({ error: check.code }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: String(token).trim(),
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'invalid_reset_token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return NextResponse.json({ message: 'password_updated' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
