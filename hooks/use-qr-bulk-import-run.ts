'use client';

import { toast } from 'sonner';
import type { Locale } from '@/lib/i18n/types';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { BulkResult, UsageInfo } from '@/lib/qr-bulk-import-types';
import type { BulkParsedRow } from '@/lib/bulk-csv';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export async function runQrBulkImport({
  rows,
  batchLabel,
  slotsLeft,
  usage,
  setErrors,
  setResult,
  setProgress,
  setImporting,
  t,
  locale,
}: {
  rows: BulkParsedRow[];
  batchLabel: string;
  slotsLeft: number;
  usage: UsageInfo;
  setErrors: (errors: { line: number; message: string }[]) => void;
  setResult: (result: BulkResult | null) => void;
  setProgress: (progress: number | ((p: number) => number)) => void;
  setImporting: (importing: boolean) => void;
  t: Translate;
  locale: Locale;
}): Promise<boolean> {
  if (!rows.length) {
    toast.error(t('bulk.uploadFirst'));
    return false;
  }
  if (rows.length > slotsLeft) {
    toast.error(
      t('bulk.slotsLeft', {
        remaining: formatLocaleNumber(slotsLeft, locale),
        limit: formatLocaleNumber(usage.qrLimit, locale),
      }),
    );
    return false;
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
      return false;
    }

    setResult(data);
    setProgress(100);
    toast.success(
      t('bulk.createdSuccess', { count: formatLocaleNumber(data.summary.success, locale) }),
    );
    return true;
  } catch {
    toast.error(t('bulk.somethingWrong'));
    return false;
  } finally {
    window.clearInterval(tick);
    setImporting(false);
  }
}
