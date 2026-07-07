'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { Locale } from '@/lib/i18n/types';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { parseBulkCSV, type BulkParsedRow, type BulkParseError } from '@/lib/bulk-csv';

export function useQrBulkImportFile({
  maxRows,
  t,
  locale,
}: {
  maxRows: number;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<BulkParsedRow[]>([]);
  const [errors, setErrors] = useState<BulkParseError[]>([]);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? '');
        const parsed = parseBulkCSV(text, maxRows);
        setRows(parsed.rows);
        setErrors(parsed.errors);
        if (parsed.errors.length) {
          toast.error(t('bulk.rowsError', { count: formatLocaleNumber(parsed.errors.length, locale) }));
        } else if (parsed.rows.length) {
          toast.success(t('bulk.rowsReady', { count: formatLocaleNumber(parsed.rows.length, locale) }));
        } else {
          toast.error(t('bulk.noValidRows'));
        }
      };
      reader.onerror = () => toast.error(t('bulk.readFileError'));
      reader.readAsText(file);
    },
    [maxRows, t, locale],
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

  const clearFile = () => {
    setRows([]);
    setErrors([]);
    setFileName(null);
  };

  return { fileName, rows, setRows, errors, setErrors, onFileChange, onDrop, clearFile };
}
