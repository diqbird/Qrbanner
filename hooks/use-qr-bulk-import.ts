'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { BulkResult } from '@/lib/qr-bulk-import-types';
import { downloadBulkCsvTemplate, exportBulkResultCsv } from '@/lib/qr-bulk-import-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrBulkImportUsage } from '@/hooks/use-qr-bulk-import-usage';
import { useQrBulkImportFile } from '@/hooks/use-qr-bulk-import-file';
import { runQrBulkImport } from '@/hooks/use-qr-bulk-import-run';

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
    errors,
    setErrors,
    onFileChange,
    onDrop,
    clearFile,
  } = useQrBulkImportFile({ maxRows, t });

  const handleImport = async () => {
    if (errors.length) {
      toast.error(t('bulk.fixErrors'));
      return;
    }
    await runQrBulkImport({
      rows,
      batchLabel,
      slotsLeft,
      usage,
      setErrors,
      setResult,
      setProgress,
      setImporting,
      t,
    });
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
