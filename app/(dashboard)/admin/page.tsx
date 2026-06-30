import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { AdminContent } from '@/components/admin/admin-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Site Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }
  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminContent />;
}
