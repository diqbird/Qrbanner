'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { BULK_CSV_TEMPLATE } from '@/lib/bulk-csv';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

export function BulkImportTemplateCard({ bulk }: { bulk: QrBulkImportState }) {
  const { t, downloadTemplate } = bulk;

  return (
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
  );
}
