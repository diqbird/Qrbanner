'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { parseBulkCSV, type BulkParsedRow, type BulkParseError } from '@/lib/bulk-csv';

export function useQrBulkImportFile({
  maxRows,
  t,
}: {
  maxRows: number;
  t: (key: string, vars?: Record<string, string | number>) => string;
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

  const clearFile = () => {
    setRows([]);
    setErrors([]);
    setFileName(null);
  };

  return { fileName, rows, setRows, errors, setErrors, onFileChange, onDrop, clearFile };
}
