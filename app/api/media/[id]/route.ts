export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteUploadedFile } from '@/lib/storage';
import { requireSessionContext, isAuthError } from '@/lib/session-auth';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireSessionContext();
    if (isAuthError(auth)) return auth;
    const { userId, role } = auth;

    const asset = await prisma.mediaAsset.findUnique({ where: { id: params.id } });
    if (!asset) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const isAdmin = role === 'admin';
    if (!isAdmin && asset.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteUploadedFile(asset.url);
    await prisma.mediaAsset.delete({ where: { id: asset.id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
