'use client';

import { DashboardPageSkeleton } from './dashboard-page-skeleton';
import { DashboardOverviewSection } from './dashboard-overview-section';
import { DashboardQrListCard } from './dashboard-qr-list-card';
import { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

export function DashboardContent() {
  const list = useDashboardQrList();

  if (list.loading && list.qrCodes.length === 0) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardOverviewSection list={list} />
      <DashboardQrListCard list={list} />
    </div>
  );
}
