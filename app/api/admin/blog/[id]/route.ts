export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';
import type { Prisma } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.description !== undefined) data.description = String(body.description).trim();
    if (body.published !== undefined) {
      data.published = Boolean(body.published);
      if (body.published) data.publishedAt = new Date();
    }
    if (body.sections !== undefined) {
      data.sections = body.sections as Prisma.InputJsonValue;
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ post });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
