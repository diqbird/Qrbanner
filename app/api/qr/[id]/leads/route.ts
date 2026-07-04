export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { assertQrAccess } from '@/lib/workspace';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
