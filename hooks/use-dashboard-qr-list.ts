'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrListData } from '@/hooks/use-qr-list-data';
import { useQrListActions } from '@/hooks/use-qr-list-actions';

export type { ListMeta, ListTotals, ListPagination } from '@/lib/dashboard-qr-list-types';

export function useDashboardQrList() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const scanBaseUrl = useScanBaseUrl();

  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [unfiledFilter, setUnfiledFilter] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchPending = searchQuery.trim() !== debouncedSearch.trim();
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [page, setPage] = useState(1);

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
    folderFilter,
    unfiledFilter,
    labelFilter,
    batchFilter,
    debouncedSearch,
    favoritesFilter,
    archivedFilter,
    page,
  });

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

  useEffect(() => {
    setPage(1);
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, debouncedSearch, favoritesFilter, archivedFilter]);

  useEffect(() => {
    const batchFromUrl = searchParams.get('batchId');
    if (batchFromUrl) setBatchFilter(batchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const focusSearch = () => searchInputRef.current?.focus();
    window.addEventListener('dashboard:focus-search', focusSearch);
    return () => window.removeEventListener('dashboard:focus-search', focusSearch);
  }, []);

  const handleSelectFolder = (folderId: string | null, unfiled?: boolean) => {
    setFolderFilter(folderId);
    setUnfiledFilter(Boolean(unfiled));
    setBatchFilter(null);
    setLabelFilter(null);
  };

  const clearFilters = () => {
    setFolderFilter(null);
    setUnfiledFilter(false);
    setLabelFilter(null);
    setBatchFilter(null);
    setSearchQuery('');
    setFavoritesFilter(false);
    setArchivedFilter(false);
  };

  const hasFilters =
    folderFilter ||
    unfiledFilter ||
    labelFilter ||
    batchFilter ||
    debouncedSearch.trim() ||
    favoritesFilter ||
    archivedFilter;

  const stats = hasFilters
    ? {
        total: totals.filteredTotal,
        totalScans: totals.filteredScans,
        active: totals.filteredActive,
      }
    : {
        total: totals.accountQrCount,
        totalScans: totals.accountTotalScans,
        active: totals.accountActiveCount,
      };

  const rangeFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeTo = Math.min(pagination.page * pagination.limit, pagination.total);

  return {
    qrCodes,
    folders,
    meta,
    loading,
    totals,
    pagination,
    folderFilter,
    unfiledFilter,
    labelFilter,
    batchFilter,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    searchInputRef,
    isSearchPending,
    favoritesFilter,
    setFavoritesFilter,
    archivedFilter,
    setArchivedFilter,
    selectedIds,
    setSelectedIds,
    page,
    setPage,
    zipExporting,
    hasFilters,
    stats,
    rangeFrom,
    rangeTo,
    handleSelectFolder,
    handleDelete,
    handleDuplicate,
    moveToFolder,
    toggleSelect,
    runBulk,
    runBulkZip,
    toggleFavorite,
    clearFilters,
    fetchFolders,
    fetchQRCodes,
    refreshFoldersAndList,
    setLabelFilter,
    setBatchFilter,
  };
}
