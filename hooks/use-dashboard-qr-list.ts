'use client';

import { useMemo } from 'react';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrListData } from '@/hooks/use-qr-list-data';
import { useQrListActions } from '@/hooks/use-qr-list-actions';
import { useDashboardQrFilters } from '@/hooks/use-dashboard-qr-filters';
import {
  computeDashboardQrListRange,
  computeDashboardQrListStats,
} from '@/lib/dashboard-qr-list-stats';

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
    () => computeDashboardQrListStats(Boolean(filters.hasFilters), totals),
    [filters.hasFilters, totals],
  );

  const { rangeFrom, rangeTo } = useMemo(
    () => computeDashboardQrListRange(pagination),
    [pagination],
  );

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
