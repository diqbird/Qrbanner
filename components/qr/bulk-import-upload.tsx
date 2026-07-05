'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { BULK_CSV_TEMPLATE } from '@/lib/bulk-csv';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

type BulkImportUploadProps = {
  bulk: QrBulkImportState;
};

export function BulkImportUpload({ bulk }: BulkImportUploadProps) {
  const {
    t,
    maxRows,
    fileRef,
    fileName,
    batchLabel,
    setBatchLabel,
    errors,
    downloadTemplate,
    onDrop,
    onFileChange,
  } = bulk;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5" />
              {t('bulk.templateTitle')}
            </CardTitle>
            <CardDescription>{t('bulk.templateDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
              {BULK_CSV_TEMPLATE.trim()}
            </div>
            <Button variant="outline" onClick={downloadTemplate} className="gap-2">
              <Download className="h-4 w-4" /> {t('bulk.downloadTemplate')}
            </Button>
            <p className="text-xs text-muted-foreground">{t('bulk.templateHint')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5" />
              {t('bulk.uploadTitle')}
            </CardTitle>
            <CardDescription>{t('bulk.uploadDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-colors hover:border-primary/50 hover:bg-muted/40"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">{fileName ?? t('bulk.dropHint')}</p>
              <p className="text-xs text-muted-foreground">{t('bulk.csvOnly', { max: maxRows })}</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchLabel">{t('bulk.batchLabel')}</Label>
              <Input
                id="batchLabel"
                placeholder={t('bulk.batchPlaceholder')}
                value={batchLabel}
                onChange={(e) => setBatchLabel(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('bulk.batchHint')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {errors.length > 0 && (
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
      )}
    </>
  );
}
