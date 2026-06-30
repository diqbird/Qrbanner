export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`login:${ip}`, 20, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    return NextResponse.json({ message: 'login_success', userId: user.id });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
