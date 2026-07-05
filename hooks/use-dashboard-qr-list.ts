'use client';

import { useMemo } from 'react';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrListData } from '@/hooks/use-qr-list-data';
import { useQrListActions } from '@/hooks/use-qr-list-actions';
import { useDashboardQrFilters } from '@/hooks/use-dashboard-qr-filters';

export type { ListMeta, ListTotals, ListPagination } from '@/lib/dashboard-qr-list-types';

export function useDashboardQrList() {
  const { t } = useLanguage();
  const scanBaseUrl = useScanBaseUrl();
  const filters = useDashboardQrFilters();

  const {
    qrCodes,
    folders,
    meta,
    loading,
    totals,
    pagination,
    fetchFolders,
    fetchQRCodes,
    refreshFoldersAndList,
  } = useQrListData({
    folderFilter: filters.folderFilter,
    unfiledFilter: filters.unfiledFilter,
    labelFilter: filters.labelFilter,
    batchFilter: filters.batchFilter,
    debouncedSearch: filters.debouncedSearch,
    favoritesFilter: filters.favoritesFilter,
    archivedFilter: filters.archivedFilter,
    page: filters.page,
  });

  const stats = useMemo(
    () =>
      filters.hasFilters
        ? {
            total: totals.filteredTotal,
            totalScans: totals.filteredScans,
            active: totals.filteredActive,
          }
        : {
            total: totals.accountQrCount,
            totalScans: totals.accountTotalScans,
            active: totals.accountActiveCount,
          },
    [filters.hasFilters, totals],
  );

  const rangeFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeTo = Math.min(pagination.page * pagination.limit, pagination.total);

  const {
    selectedIds,
    setSelectedIds,
    zipExporting,
    handleDelete,
    handleDuplicate,
    moveToFolder,
    toggleSelect,
    runBulk,
    runBulkZip,
    toggleFavorite,
  } = useQrListActions({
    t,
    scanBaseUrl,
    fetchQRCodes,
    refreshFoldersAndList,
  });

  return {
    qrCodes,
    folders,
    meta,
    loading,
    totals,
    pagination,
    selectedIds,
    setSelectedIds,
    zipExporting,
    handleDelete,
    handleDuplicate,
    moveToFolder,
    toggleSelect,
    runBulk,
    runBulkZip,
    toggleFavorite,
    fetchFolders,
    fetchQRCodes,
    refreshFoldersAndList,
    stats,
    rangeFrom,
    rangeTo,
    ...filters,
  };
}
