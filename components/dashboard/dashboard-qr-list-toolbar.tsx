'use client';

import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';
import {
  DashboardQrListSearchBar,
  DashboardQrListBulkBar,
  DashboardQrListMetaFilters,
} from './dashboard-qr-list-toolbar-sections';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListToolbar({ list }: { list: DashboardList }) {
  return (
    <>
      <DashboardQrListSearchBar list={list} />
      <DashboardQrListBulkBar list={list} />
      <DashboardQrListMetaFilters list={list} />
    </>
  );
}
