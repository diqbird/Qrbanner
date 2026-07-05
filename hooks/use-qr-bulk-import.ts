'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { parseBulkCSV, type BulkParsedRow, type BulkParseError } from '@/lib/bulk-csv';
import {
  defaultBulkUsage,
  type BulkResult,
  type UsageInfo,
} from '@/lib/qr-bulk-import-types';
import { downloadBulkCsvTemplate, exportBulkResultCsv } from '@/lib/qr-bulk-import-utils';
import { useLanguage } from '@/components/i18n/language-provider';

export type { CreatedQR, BulkResult, UsageInfo } from '@/lib/qr-bulk-import-types';

export function useQrBulkImport() {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [batchLabel, setBatchLabel] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<BulkParsedRow[]>([]);
  const [errors, setErrors] = useState<BulkParseError[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [usage, setUsage] = useState<UsageInfo>(defaultBulkUsage);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.usage) return;
        setUsage({
          maxBulkRows: data.usage.bulkRowLimit ?? 100,
          qrLimit: data.usage.qrLimit ?? 25,
          qrCodes: data.usage.qrCodes ?? 0,
          planName: data.plan?.name ?? 'Free',
        });
      })
      .catch(() => undefined);
  }, []);

  const maxRows = usage.maxBulkRows;
  const slotsLeft = Math.max(0, usage.qrLimit - usage.qrCodes);

  const handleFile = useCallback(
    (file: File) => {
      setResult(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? '');
        const parsed = parseBulkCSV(text, maxRows);
        setRows(parsed.rows);
        setErrors(parsed.errors);
        if (parsed.errors.length) {
          toast.error(t('bulk.rowsError', { count: parsed.errors.length }));
        } else if (parsed.rows.length) {
          toast.success(t('bulk.rowsReady', { count: parsed.rows.length }));
        } else {
          toast.error(t('bulk.noValidRows'));
        }
      };
      reader.onerror = () => toast.error(t('bulk.readFileError'));
      reader.readAsText(file);
    },
    [maxRows, t],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.name?.endsWith('.csv') || file?.type === 'text/csv') {
      handleFile(file);
    } else {
      toast.error(t('bulk.csvOnlyError'));
    }
  };

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
    setRows([]);
    setErrors([]);
    setFileName(null);
    setResult(null);
    setProgress(0);
    setBatchLabel('');
    if (fileRef.current) fileRef.current.value = '';
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
    onFileChange,
    onDrop,
    handleImport,
    reset,
    exportResultCsv: () => result && exportBulkResultCsv(result),
  };
}

export type QrBulkImportState = ReturnType<typeof useQrBulkImport>;
