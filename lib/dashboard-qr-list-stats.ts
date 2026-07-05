import type { ListPagination, ListTotals } from '@/lib/dashboard-qr-list-types';

export function computeDashboardQrListStats(
  hasFilters: boolean,
  totals: ListTotals,
): { total: number; totalScans: number; active: number } {
  if (hasFilters) {
    return {
      total: totals.filteredTotal,
      totalScans: totals.filteredScans,
      active: totals.filteredActive,
    };
  }
  return {
    total: totals.accountQrCount,
    totalScans: totals.accountTotalScans,
    active: totals.accountActiveCount,
  };
}

export function computeDashboardQrListRange(pagination: ListPagination) {
  const rangeFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeTo = Math.min(pagination.page * pagination.limit, pagination.total);
  return { rangeFrom, rangeTo };
}
