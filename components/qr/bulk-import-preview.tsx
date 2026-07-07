'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

type BulkImportPreviewProps = {
  bulk: QrBulkImportState;
};

export function BulkImportPreview({ bulk }: BulkImportPreviewProps) {
  const { t, rows, errors, importing, progress, slotsLeft, handleImport } = bulk;

  if (!rows.length) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{t('bulk.previewTitle', { count: rows.length })}</CardTitle>
          <CardDescription>{t('bulk.previewDesc')}</CardDescription>
        </div>
        <Button
          onClick={handleImport}
          disabled={importing || errors.length > 0 || rows.length > slotsLeft}
          className="gap-2"
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t('bulk.creating')}
            </>
          ) : (
            t(rows.length === 1 ? 'bulk.createBtn' : 'bulk.createBtnPlural', { count: rows.length })
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {importing && <Progress value={progress} className="h-2" />}
        <div className="max-h-96 overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{t('bulk.name')}</TableHead>
                <TableHead>{t('bulk.category')}</TableHead>
                <TableHead>{t('bulk.content')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.line}>
                  <TableCell className="text-muted-foreground">{row.line}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{resolveCategoryShortName(t, row.category)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground">
                    {row.qrData.url ?? row.qrData.phone ?? row.qrData.ssid ?? row.qrData.email ?? t('common.emptyValue')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
