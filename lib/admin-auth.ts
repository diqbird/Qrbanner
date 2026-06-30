import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') return null;
  return session;
}

export async function requireAdminUserId(): Promise<string | null> {
  const session = await getAdminSession();
  return (session?.user as { id?: string })?.id ?? null;
}
