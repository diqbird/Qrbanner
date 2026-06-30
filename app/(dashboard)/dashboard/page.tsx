import { DashboardContent } from '@/components/dashboard/dashboard-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your QR codes and view analytics overview.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
