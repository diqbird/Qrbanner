'use client';

import { useCallback, useEffect, useState } from 'react';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import type { QRCodeItem } from '@/lib/qr-list-row-types';
import { QR_LIST_MAX_LIMIT } from '@/lib/qr-list-pagination';
import type { ListMeta, ListPagination, ListTotals } from '@/lib/dashboard-qr-list-types';

export function useQrListData({
  folderFilter,
  unfiledFilter,
  labelFilter,
  batchFilter,
  debouncedSearch,
  favoritesFilter,
  archivedFilter,
  page,
}: {
  folderFilter: string | null;
  unfiledFilter: boolean;
  labelFilter: string | null;
  batchFilter: string | null;
  debouncedSearch: string;
  favoritesFilter: boolean;
  archivedFilter: boolean;
  page: number;
}) {
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
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    setLoading(true);
    fetchQRCodes();
  }, [fetchQRCodes]);

  const refreshFoldersAndList = useCallback(() => {
    fetchQRCodes();
    fetchFolders();
  }, [fetchQRCodes, fetchFolders]);

  return {
    qrCodes,
    folders,
    meta,
    loading,
    totals,
    pagination,
    fetchFolders,
    fetchQRCodes,
    refreshFoldersAndList,
  };
}
