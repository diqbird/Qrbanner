'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download } from 'lucide-react';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';
import { BulkImportResultFailures } from './bulk-import-result-failures';
import { BulkImportResultTable } from './bulk-import-result-table';

type BulkImportResultProps = {
  bulk: QrBulkImportState;
};

export function BulkImportResult({ bulk }: BulkImportResultProps) {
  const router = useRouter();
  const { t, result, reset, exportResultCsv } = bulk;

  if (!result) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          {t('bulk.importComplete')}
        </CardTitle>
        <CardDescription>
          {t('bulk.importSummary', {
            success: result.summary.success,
            total: result.summary.total,
          })}
          {result.batchLabel ? ` · ${t('bulk.batch')}: ${result.batchLabel}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BulkImportResultFailures failed={result.failed} t={t} />
        <BulkImportResultTable created={result.created} t={t} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push('/dashboard')}>{t('bulk.goDashboard')}</Button>
          <Button variant="outline" onClick={exportResultCsv} className="gap-2">
            <Download className="h-4 w-4" /> {t('bulk.exportCsv')}
          </Button>
          <Button variant="outline" onClick={reset}>
            {t('bulk.importAnother')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
