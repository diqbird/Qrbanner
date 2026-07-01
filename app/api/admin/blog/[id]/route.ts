export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';
import type { Prisma } from '@prisma/client';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to load post';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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
    const data: Prisma.BlogPostUpdateInput = {};

    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.slug !== undefined) {
      data.slug = String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }
    if (body.description !== undefined) data.description = String(body.description).trim();
    if (body.category !== undefined) data.category = String(body.category).trim();
    if (body.author !== undefined) data.author = String(body.author).trim();
    if (body.readingMinutes !== undefined) data.readingMinutes = Number(body.readingMinutes) || 8;
    if (body.keywords !== undefined) {
      data.keywords = Array.isArray(body.keywords)
        ? body.keywords.map(String)
        : String(body.keywords)
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
    }
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

    const actor = await getAdminActorContext(adminId, req);
    await recordAdminAudit({
      ...actor,
      action: 'blog.update',
      targetType: 'blog_post',
      targetId: post.id,
      summary: post.slug,
      metadata: { slug: post.slug, title: post.title, published: post.published },
    });

    return NextResponse.json({ post });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const existing = await prisma.blogPost.findUnique({
      where: { id: params.id },
      select: { id: true, slug: true, title: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await prisma.blogPost.delete({ where: { id: params.id } });
    const actor = await getAdminActorContext(adminId, req);
    await recordAdminAudit({
      ...actor,
      action: 'blog.delete',
      targetType: 'blog_post',
      targetId: existing.id,
      summary: existing.slug,
      metadata: { slug: existing.slug, title: existing.title },
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
