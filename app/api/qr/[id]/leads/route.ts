export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { assertQrAccess } from '@/lib/workspace';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const access = await assertQrAccess(userId, params.id, 'viewer');
  if (!access.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const qrCode = access.qr;

  const take = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 50), 200);

  const leads = await prisma.leadSubmission.findMany({
    where: { qrCodeId: qrCode.id },
    orderBy: { createdAt: 'desc' },
    take,
  });

  const total = await prisma.leadSubmission.count({ where: { qrCodeId: qrCode.id } });

  return NextResponse.json({ leads, total });
}
