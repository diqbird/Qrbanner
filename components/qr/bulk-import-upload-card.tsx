'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

export function BulkImportUploadCard({ bulk }: { bulk: QrBulkImportState }) {
  const {
    t,
    maxRows,
    fileRef,
    fileName,
    batchLabel,
    setBatchLabel,
    onDrop,
    onFileChange,
  } = bulk;

  return (
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
  );
}
