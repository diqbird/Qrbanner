export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { normalizeLabels } from '@/lib/organize-utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { qrIds, folderId, labels, mode } = body as {
      qrIds?: string[];
      folderId?: string | null;
      labels?: string[] | string;
      mode?: 'set' | 'add' | 'remove';
    };

    if (!Array.isArray(qrIds) || qrIds.length === 0) {
      return NextResponse.json({ error: 'qrIds array is required' }, { status: 400 });
    }

    if (qrIds.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 QR codes per operation' }, { status: 400 });
    }

    const owned = await prisma.qRCode.findMany({
      where: { userId, id: { in: qrIds } },
      select: { id: true, labels: true },
    });

    if (owned.length !== qrIds.length) {
      return NextResponse.json({ error: 'One or more QR codes not found' }, { status: 404 });
    }

    if (folderId) {
      const folder = await prisma.qRFolder.findFirst({ where: { id: folderId, userId } });
      if (!folder) return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const labelMode = mode ?? 'set';
    const newLabels = labels !== undefined ? normalizeLabels(labels) : null;

    await prisma.$transaction(
      owned.map((qr) => {
        const data: { folderId?: string | null; labels?: string[] } = {};

        if (folderId !== undefined) {
          data.folderId = folderId || null;
        }

        if (newLabels !== null) {
          const current = normalizeLabels(qr.labels);
          if (labelMode === 'add') {
            data.labels = normalizeLabels([...current, ...newLabels]);
          } else if (labelMode === 'remove') {
            const removeSet = new Set(newLabels.map((l) => l.toLowerCase()));
            data.labels = current.filter((l) => !removeSet.has(l.toLowerCase()));
          } else {
            data.labels = newLabels;
          }
        }

        return prisma.qRCode.update({ where: { id: qr.id }, data });
      })
    );

    return NextResponse.json({ updated: owned.length });
  } catch (error) {
    console.error('QR organize error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
