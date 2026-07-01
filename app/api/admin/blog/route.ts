export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminUserId } from '@/lib/admin-auth';
import type { Prisma } from '@prisma/client';
import type { BlogSection } from '@/lib/blog/types';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

export async function GET() {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        published: true,
        publishedAt: true,
        updatedAt: true,
        readingMinutes: true,
      },
    });
    return NextResponse.json({ posts });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = await requireAdminUserId();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const slug = String(body.slug ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const title = String(body.title ?? '').trim();

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }

    const sections = (body.sections ?? []) as BlogSection[];
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        description: String(body.description ?? '').trim() || title,
        keywords: Array.isArray(body.keywords) ? body.keywords.map(String) : [],
        category: String(body.category ?? 'Guides'),
        author: String(body.author ?? 'QRbanner Team'),
        sections: sections as unknown as Prisma.InputJsonValue,
        readingMinutes: Number(body.readingMinutes) || 8,
        published: Boolean(body.published),
        publishedAt: body.published ? new Date() : null,
      },
    });

    const actor = await getAdminActorContext(adminId, req);
    await recordAdminAudit({
      ...actor,
      action: 'blog.create',
      targetType: 'blog_post',
      targetId: post.id,
      summary: post.slug,
      metadata: { slug: post.slug, title: post.title, published: post.published },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create post';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
