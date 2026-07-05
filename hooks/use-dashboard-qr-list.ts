'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import type { QRCodeItem } from '@/components/dashboard/qr-list-row';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { QR_LIST_MAX_LIMIT } from '@/lib/qr-list-pagination';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { downloadBulkQrImagesZip, BULK_ZIP_MAX } from '@/lib/bulk-qr-zip-export';
import { useLanguage } from '@/components/i18n/language-provider';

export interface ListMeta {
  labels: string[];
  batches: { id: string; name: string }[];
}

export interface ListTotals {
  accountQrCount: number;
  accountActiveCount: number;
  accountTotalScans: number;
  filteredTotal: number;
  filteredScans: number;
  filteredActive: number;
}

export interface ListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useDashboardQrList() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const scanBaseUrl = useScanBaseUrl();

  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [folders, setFolders] = useState<QRFolderOption[]>([]);
  const [meta, setMeta] = useState<ListMeta>({ labels: [], batches: [] });
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<ListTotals>({
    accountQrCount: 0,
    accountActiveCount: 0,
    accountTotalScans: 0,
    filteredTotal: 0,
    filteredScans: 0,
    filteredActive: 0,
  });
  const [pagination, setPagination] = useState<ListPagination>({
    page: 1,
    limit: QR_LIST_MAX_LIMIT,
    total: 0,
    totalPages: 1,
  });

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [zipExporting, setZipExporting] = useState(false);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchQRCodes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (unfiledFilter) params.set('unfiled', '1');
      else if (folderFilter) params.set('folderId', folderFilter);
      if (labelFilter) params.set('label', labelFilter);
      if (batchFilter) params.set('batchId', batchFilter);
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      if (favoritesFilter) params.set('favorites', '1');
      if (archivedFilter) params.set('archived', '1');
      params.set('page', String(page));
      params.set('limit', String(QR_LIST_MAX_LIMIT));

      const res = await fetch(`/api/qr?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setQrCodes(data?.qrCodes ?? []);
        setMeta(data?.meta ?? { labels: [], batches: [] });
        if (data?.totals) setTotals(data.totals);
        if (data?.pagination) setPagination(data.pagination);
      }
    } catch {
      console.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  }, [
    folderFilter,
    unfiledFilter,
    labelFilter,
    batchFilter,
    debouncedSearch,
    favoritesFilter,
    archivedFilter,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, debouncedSearch, favoritesFilter, archivedFilter]);

  useEffect(() => {
    const batchFromUrl = searchParams.get('batchId');
    if (batchFromUrl) setBatchFilter(batchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    const focusSearch = () => searchInputRef.current?.focus();
    window.addEventListener('dashboard:focus-search', focusSearch);
    return () => window.removeEventListener('dashboard:focus-search', focusSearch);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchQRCodes();
  }, [fetchQRCodes]);

  const refreshFoldersAndList = useCallback(() => {
    fetchQRCodes();
    fetchFolders();
  }, [fetchQRCodes, fetchFolders]);

  const handleSelectFolder = (folderId: string | null, unfiled?: boolean) => {
    setFolderFilter(folderId);
    setUnfiledFilter(Boolean(unfiled));
    setBatchFilter(null);
    setLabelFilter(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(t('dashboard.deletedSuccess'));
        refreshFoldersAndList();
      } else {
        toast.error(t('dashboard.deleteFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/qr/${id}?action=duplicate`, { method: 'POST' });
      if (res.ok) {
        toast.success(t('dashboard.duplicatedSuccess'));
        refreshFoldersAndList();
      } else {
        toast.error(t('dashboard.duplicateFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const moveToFolder = async (qrId: string, folderId: string | null) => {
    try {
      const res = await fetch('/api/qr/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrIds: [qrId], folderId }),
      });
      if (!res.ok) return toast.error(t('dashboard.moveFailed'));
      toast.success(folderId ? t('dashboard.movedToFolder') : t('dashboard.removedFromFolder'));
      refreshFoldersAndList();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const runBulk = async (action: string) => {
    if (!selectedIds.length) return;
    if (action === 'delete' && !confirm(t('dashboard.deleteBulkConfirm', { count: selectedIds.length })))
      return;
    try {
      const res = await fetch('/api/qr/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (action === 'export' && res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qr-export.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success(t('dashboard.exportDownloaded'));
      } else if (res.ok) {
        toast.success(t('dashboard.bulkCompleted'));
        setSelectedIds([]);
        fetchQRCodes();
      } else {
        toast.error(t('dashboard.bulkFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const runBulkZip = async () => {
    if (!selectedIds.length) return;
    if (selectedIds.length > BULK_ZIP_MAX) {
      toast.error(t('dashboard.bulkZipTooMany', { max: BULK_ZIP_MAX }));
      return;
    }
    setZipExporting(true);
    try {
      const res = await fetch('/api/qr/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exportImagesMeta', ids: selectedIds }),
      });
      if (!res.ok) {
        toast.error(t('dashboard.bulkZipFailed'));
        return;
      }
      const { items } = await res.json();
      const count = await downloadBulkQrImagesZip(items ?? [], scanBaseUrl);
      toast.success(t('dashboard.bulkZipDownloaded', { count }));
    } catch {
      toast.error(t('dashboard.bulkZipFailed'));
    } finally {
      setZipExporting(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const res = await fetch('/api/qr/bulk-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: current ? 'unfavorite' : 'favorite', ids: [id] }),
    });
    if (res.ok) fetchQRCodes();
    else toast.error(t('dashboard.favoriteFailed'));
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
