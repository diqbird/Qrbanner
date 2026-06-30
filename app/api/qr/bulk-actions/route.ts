export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const action = body?.action as string;
    const ids = Array.isArray(body?.ids) ? (body.ids as string[]).filter(Boolean) : [];
    if (!ids.length) return NextResponse.json({ error: 'No QR codes selected' }, { status: 400 });

    const workspaceId = await getActiveWorkspaceId(userId);
    const owned = await prisma.qRCode.findMany({
      where: { id: { in: ids }, workspaceId },
      select: { id: true, name: true, shortCode: true, category: true, totalScans: true },
    });
    if (!owned.length) return NextResponse.json({ error: 'No matching QR codes' }, { status: 404 });

    const ownedIds = owned.map((q) => q.id);

    if (action === 'delete') {
      const canEdit = await assertWorkspaceRole(userId, workspaceId, 'editor');
      if (!canEdit.ok) return NextResponse.json({ error: 'Editor role required' }, { status: 403 });
      await prisma.qRCode.deleteMany({ where: { id: { in: ownedIds } } });
      return NextResponse.json({ ok: true, count: ownedIds.length });
    }

    if (action === 'archive') {
      await prisma.qRCode.updateMany({ where: { id: { in: ownedIds } }, data: { isArchived: true, isActive: false } });
      return NextResponse.json({ ok: true, count: ownedIds.length });
    }

    if (action === 'unarchive') {
      await prisma.qRCode.updateMany({ where: { id: { in: ownedIds } }, data: { isArchived: false, isActive: true } });
      return NextResponse.json({ ok: true, count: ownedIds.length });
    }

    if (action === 'favorite') {
      await prisma.qRCode.updateMany({ where: { id: { in: ownedIds } }, data: { isFavorite: true } });
      return NextResponse.json({ ok: true, count: ownedIds.length });
    }

    if (action === 'unfavorite') {
      await prisma.qRCode.updateMany({ where: { id: { in: ownedIds } }, data: { isFavorite: false } });
      return NextResponse.json({ ok: true, count: ownedIds.length });
    }

    if (action === 'export') {
      const csv = [
        'name,shortCode,category,totalScans',
        ...owned.map((q) =>
          `"${q.name.replace(/"/g, '""')}",${q.shortCode},${q.category},${q.totalScans}`
        ),
      ].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="qr-export.csv"',
        },
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    console.error('Bulk action error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
