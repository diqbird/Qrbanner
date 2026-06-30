export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';

async function getUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;
  return userId;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const folders = await prisma.qRFolder.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { qrCodes: true } } },
    });

    return NextResponse.json({
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        color: f.color,
        qrCount: f._count.qrCodes,
        createdAt: f.createdAt,
      })),
    });
  } catch (error) {
    console.error('Folders list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = normalizeFolderName(body.name ?? '');
    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const existing = await prisma.qRFolder.findFirst({ where: { userId, name } });
    if (existing) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 409 });
    }

    const color = FOLDER_COLORS.includes(body.color) ? body.color : FOLDER_COLORS[0];

    const folder = await prisma.qRFolder.create({
      data: { userId, name, color },
    });

    return NextResponse.json({ folder: { ...folder, qrCount: 0 } });
  } catch (error) {
    console.error('Folder create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
