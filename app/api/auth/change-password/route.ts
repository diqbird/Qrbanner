export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validatePassword } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'sso_account' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'wrong_current_password' }, { status: 400 });
    }

    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.ok) {
      return NextResponse.json({ error: pwCheck.code }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'password_changed' });
  } catch (error: unknown) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
