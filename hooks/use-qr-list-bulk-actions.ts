'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { downloadBulkQrImagesZip, BULK_ZIP_MAX } from '@/lib/bulk-qr-zip-export';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useQrListBulkActions({
  t,
  scanBaseUrl,
  fetchQRCodes,
  selectedIds,
  setSelectedIds,
}: {
  t: Translate;
  scanBaseUrl: string;
  fetchQRCodes: () => Promise<void>;
  selectedIds: string[];
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
}) {
  const [zipExporting, setZipExporting] = useState(false);

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

  return { zipExporting, runBulk, runBulkZip };
}

export { useQrListItemActions } from '@/hooks/use-qr-list-item-actions';
