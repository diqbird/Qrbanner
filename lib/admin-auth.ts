import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const mfaVerified = (session as { mfaVerified?: boolean }).mfaVerified;
  if (mfaVerified === false) return null;

  const userId = (session.user as { id?: string }).id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== 'admin') return null;

  return session;
}

export async function requireAdminUserId(): Promise<string | null> {
  const session = await getAdminSession();
  return (session?.user as { id?: string })?.id ?? null;
}
