'use client';

import { AlertCircle } from 'lucide-react';

export function BulkImportResultFailures({
  failed,
  t,
}: {
  failed: { line: number; message: string }[];
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  if (failed.length === 0) return null;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
        <AlertCircle className="h-4 w-4" />
        {t('bulk.rowsFailed', { count: failed.length })}
      </p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {failed.map((err) => (
          <li key={`${err.line}-${err.message}`}>
            {t('bulk.line')} {err.line}: {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
