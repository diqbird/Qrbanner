import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { AdminQueryProvider } from '@/providers/admin-query-provider';
import { AdminShell } from '@/components/admin/shell/admin-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <AdminQueryProvider>
      <AdminShell>{children}</AdminShell>
    </AdminQueryProvider>
  );
}
