'use client';

import { useCallback } from 'react';
import type { QRCodeItem } from '@/lib/qr-list-row-types';
import { QR_LIST_MAX_LIMIT } from '@/lib/qr-list-pagination';
import type { ListMeta, ListPagination, ListTotals } from '@/lib/dashboard-qr-list-types';

export function useQrListFetch({
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
}: {
  folderFilter: string | null;
  unfiledFilter: boolean;
  labelFilter: string | null;
  batchFilter: string | null;
  debouncedSearch: string;
  favoritesFilter: boolean;
  archivedFilter: boolean;
  page: number;
  setQrCodes: (items: QRCodeItem[]) => void;
  setMeta: (meta: ListMeta) => void;
  setTotals: (totals: ListTotals) => void;
  setPagination: (pagination: ListPagination) => void;
  setLoading: (loading: boolean) => void;
}) {
  return useCallback(async () => {
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
    setQrCodes,
    setMeta,
    setTotals,
    setPagination,
    setLoading,
  ]);
}
