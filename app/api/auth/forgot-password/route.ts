export const dynamic = 'force-dynamic';

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email_required' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    if (user?.password) {
      const token = crypto.randomBytes(32).toString('base64url');
      const passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken: token, passwordResetExpiry },
      });

      await sendPasswordResetEmail(user.email, token, user.name);
    }

    return NextResponse.json({ message: 'reset_email_sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
