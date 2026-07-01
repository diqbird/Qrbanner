export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { decryptTotpSecret, encryptTotpSecret, verifyTotpCode } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '').trim();
  if (!code) return NextResponse.json({ error: 'mfa_code_required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpPendingSecret: true },
  });
  if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  if (user.totpEnabled) return NextResponse.json({ error: 'mfa_already_enabled' }, { status: 400 });

  const pending = decryptTotpSecret(user.totpPendingSecret);
  if (!pending) return NextResponse.json({ error: 'mfa_setup_expired' }, { status: 400 });
  if (!verifyTotpCode(pending, code)) {
    return NextResponse.json({ error: 'invalid_mfa_code' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totpEnabled: true,
      totpSecret: encryptTotpSecret(pending),
      totpPendingSecret: null,
    },
  });

  return NextResponse.json({ ok: true });
}
