'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle2, AlertCircle, Download, ExternalLink } from 'lucide-react';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

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
        {result.failed.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              {t('bulk.rowsFailed', { count: result.failed.length })}
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {result.failed.map((err) => (
                <li key={`${err.line}-${err.message}`}>
                  {t('bulk.line')} {err.line}: {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="max-h-80 overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('bulk.name')}</TableHead>
                <TableHead>{t('bulk.shortCode')}</TableHead>
                <TableHead>{t('bulk.category')}</TableHead>
                <TableHead className="text-right">{t('bulk.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.created.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell className="font-medium">{qr.name}</TableCell>
                  <TableCell>
                    <code className="text-xs">{qr.shortCode}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{qr.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/qr/${qr.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {t('bulk.edit')} <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
