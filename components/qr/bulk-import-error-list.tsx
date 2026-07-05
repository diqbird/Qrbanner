'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

export function BulkImportErrorList({ bulk }: { bulk: QrBulkImportState }) {
  const { t, errors } = bulk;

  if (errors.length === 0) return null;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive text-lg">
          <AlertCircle className="h-5 w-5" />
          {t('bulk.validationErrors', { count: errors.length })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {errors.map((err) => (
            <li key={`${err.line}-${err.message}`} className="text-destructive">
              {t('bulk.line')} {err.line}: {err.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
