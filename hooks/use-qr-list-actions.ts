'use client';

import { useState } from 'react';
import {
  useQrListBulkActions,
  useQrListItemActions,
} from '@/hooks/use-qr-list-bulk-actions';

export function useQrListActions({
  t,
  scanBaseUrl,
  fetchQRCodes,
  refreshFoldersAndList,
}: {
  t: (key: string, vars?: Record<string, string | number>) => string;
  scanBaseUrl: string;
  fetchQRCodes: () => Promise<void>;
  refreshFoldersAndList: () => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const itemActions = useQrListItemActions({ t, fetchQRCodes, refreshFoldersAndList });
  const bulkActions = useQrListBulkActions({
    t,
    scanBaseUrl,
    fetchQRCodes,
    selectedIds,
    setSelectedIds,
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return {
    selectedIds,
    setSelectedIds,
    toggleSelect,
    ...itemActions,
    ...bulkActions,
  };
}
