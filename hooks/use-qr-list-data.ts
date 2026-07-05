'use client';

import { useCallback, useEffect, useState } from 'react';
import type { QRCodeItem } from '@/lib/qr-list-row-types';
import { QR_LIST_MAX_LIMIT } from '@/lib/qr-list-pagination';
import type { ListMeta, ListPagination, ListTotals } from '@/lib/dashboard-qr-list-types';
import { useQrListFolders } from '@/hooks/use-qr-list-folders';
import { useQrListFetch } from '@/hooks/use-qr-list-fetch';

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
  const { folders, fetchFolders } = useQrListFolders();
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

  const fetchQRCodes = useQrListFetch({
    folderFilter,
    unfiledFilter,
    labelFilter,
    batchFilter,
    debouncedSearch,
    favoritesFilter,
    archivedFilter,
    page,
    setQrCodes,
    setMeta,
    setTotals,
    setPagination,
    setLoading,
  });

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
