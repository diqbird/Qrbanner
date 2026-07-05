export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserPlanUsage } from '@/lib/plan-usage';
import { requireUserId, isAuthError } from '@/lib/session-auth';

export async function GET() {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const templates = await prisma.qRStyleTemplate.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, style: true, logoPath: true, createdAt: true, updatedAt: true },
  });

  const usage = await getUserPlanUsage(userId);
  return NextResponse.json({
    templates,
    limit: usage.plan.maxStyleTemplates,
    count: templates.length,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUserId();
  if (isAuthError(auth)) return auth;
  const userId = auth;

  const usage = await getUserPlanUsage(userId);
  const count = await prisma.qRStyleTemplate.count({ where: { userId } });
  if (count >= usage.plan.maxStyleTemplates) {
    return NextResponse.json(
      { error: `Template limit reached (${usage.plan.maxStyleTemplates} on ${usage.plan.name} plan).` },
      { status: 403 }
    );
  }

  const body = await req.json();
  const name = String(body.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!body.style || typeof body.style !== 'object') {
    return NextResponse.json({ error: 'Style config is required' }, { status: 400 });
  }

  try {
    const template = await prisma.qRStyleTemplate.create({
      data: {
        userId,
        name,
        style: body.style,
        logoPath: body.logoPath ? String(body.logoPath) : null,
      },
      select: { id: true, name: true, style: true, logoPath: true, createdAt: true },
    });
    return NextResponse.json({ template });
  } catch {
    return NextResponse.json({ error: 'A template with this name already exists' }, { status: 409 });
  }
}
