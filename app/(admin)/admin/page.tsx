import { AdminDashboardPage } from '@/components/admin/pages/admin-dashboard-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Super Admin',
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return <AdminDashboardPage />;
}
