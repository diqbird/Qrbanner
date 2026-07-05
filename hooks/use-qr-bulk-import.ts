'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { BulkResult } from '@/lib/qr-bulk-import-types';
import { downloadBulkCsvTemplate, exportBulkResultCsv } from '@/lib/qr-bulk-import-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrBulkImportUsage } from '@/hooks/use-qr-bulk-import-usage';
import { useQrBulkImportFile } from '@/hooks/use-qr-bulk-import-file';

export type { CreatedQR, BulkResult, UsageInfo } from '@/lib/qr-bulk-import-types';

export function useQrBulkImport() {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [batchLabel, setBatchLabel] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);

  const { usage, maxRows, slotsLeft } = useQrBulkImportUsage();
  const {
    fileName,
    rows,
    setRows,
    errors,
    setErrors,
    onFileChange,
    onDrop,
    clearFile,
  } = useQrBulkImportFile({ maxRows, t });

  const handleImport = async () => {
    if (!rows.length) {
      toast.error(t('bulk.uploadFirst'));
      return;
    }
    if (errors.length) {
      toast.error(t('bulk.fixErrors'));
      return;
    }
    if (rows.length > slotsLeft) {
      toast.error(t('bulk.slotsLeft', { remaining: slotsLeft, limit: usage.qrLimit }));
      return;
    }

    setImporting(true);
    setProgress(5);

    const tick = window.setInterval(() => {
      setProgress((p) => (p < 85 ? p + 2 : p));
    }, 200);

    try {
      const res = await fetch('/api/qr/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchLabel: batchLabel.trim() || undefined,
          rows,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors?.length) setErrors(data.errors);
        toast.error(data?.error ?? t('bulk.importFailed'));
        return;
      }

      setResult(data);
      setProgress(100);
      toast.success(t('bulk.createdSuccess', { count: data.summary.success }));
    } catch {
      toast.error(t('bulk.somethingWrong'));
    } finally {
      window.clearInterval(tick);
      setImporting(false);
    }
  };

  const reset = () => {
    clearFile();
    setResult(null);
    setProgress(0);
    setBatchLabel('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null);
    onFileChange(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    setResult(null);
    onDrop(e);
  };

  return {
    t,
    fileRef,
    batchLabel,
    setBatchLabel,
    fileName,
    rows,
    errors,
    importing,
    progress,
    result,
    usage,
    maxRows,
    slotsLeft,
    downloadTemplate: downloadBulkCsvTemplate,
    onFileChange: handleFileChange,
    onDrop: handleDrop,
    handleImport,
    reset,
    exportResultCsv: () => result && exportBulkResultCsv(result),
  };
}

export type QrBulkImportState = ReturnType<typeof useQrBulkImport>;
