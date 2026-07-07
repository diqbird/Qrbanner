import { buildBulkCsvTemplate } from '@/lib/i18n/build-bulk-csv-template';
import type { TranslateFn } from '@/lib/i18n/resolve-enum-label';
import type { BulkResult } from '@/lib/qr-bulk-import-types';

export function downloadBulkCsvTemplate(t: TranslateFn) {
  const blob = new Blob([buildBulkCsvTemplate(t)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qrbanner-bulk-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportBulkResultCsv(result: BulkResult) {
  if (!result.created.length) return;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com';
  const lines = [
    'name,shortCode,category,scanUrl',
    ...result.created.map(
      (qr) =>
        `"${qr.name.replace(/"/g, '""')}",${qr.shortCode},${qr.category},${origin}/s/${qr.shortCode}`,
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qrbanner-import-${result.batchId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
