export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';
import {
  buildTotpQrDataUrl,
  buildTotpUri,
  encryptTotpSecret,
  generateTotpSecret,
} from '@/lib/totp';

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, totpEnabled: true, password: true },
  });
  if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  if (user.totpEnabled) return NextResponse.json({ error: 'mfa_already_enabled' }, { status: 400 });

  if (user.password) {
    if (!password) return NextResponse.json({ error: 'password_required' }, { status: 400 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'wrong_current_password' }, { status: 400 });
  }

  const secret = generateTotpSecret();
  const otpauthUrl = buildTotpUri(user.email, secret);
  const qrDataUrl = await buildTotpQrDataUrl(otpauthUrl);

  await prisma.user.update({
    where: { id: userId },
    data: { totpPendingSecret: encryptTotpSecret(secret) },
  });

  return NextResponse.json({
    otpauthUrl,
    qrDataUrl,
    secret,
  });
}
