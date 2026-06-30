export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const qrCode = await prisma.qRCode.findFirst({
    where: { id: params.id, userId },
  });
  if (!qrCode) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const take = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 50), 200);

  const leads = await prisma.leadSubmission.findMany({
    where: { qrCodeId: qrCode.id },
    orderBy: { createdAt: 'desc' },
    take,
  });

  const total = await prisma.leadSubmission.count({ where: { qrCodeId: qrCode.id } });

  return NextResponse.json({ leads, total });
}
