export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const member = await prisma.workspaceMember.findFirst({
    where: { inviteToken: params.token, status: 'pending' },
    include: { workspace: { select: { id: true, name: true } } },
  });
  if (!member) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  return NextResponse.json({
    email: member.email,
    role: member.role,
    workspace: member.workspace,
  });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const member = await prisma.workspaceMember.findFirst({
    where: { inviteToken: params.token, status: 'pending' },
  });
  if (!member) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.toLowerCase() !== member.email.toLowerCase()) {
    return NextResponse.json({ error: 'Invite email does not match your account' }, { status: 403 });
  }

  await prisma.workspaceMember.update({
    where: { id: member.id },
    data: {
      userId,
      status: 'active',
      joinedAt: new Date(),
      inviteToken: null,
    },
  });

  return NextResponse.json({ ok: true, workspaceId: member.workspaceId });
}
