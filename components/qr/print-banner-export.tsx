'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage } from 'lucide-react';
import { usePrintBannerExport } from '@/hooks/use-print-banner-export';
import type { PrintBannerExportProps } from '@/lib/print-banner-export-types';
import { PrintBannerTemplatePicker } from './print-banner-template-picker';
import { PrintBannerFieldsPanel } from './print-banner-fields-panel';

export function PrintBannerExport(props: PrintBannerExportProps) {
  const exportState = usePrintBannerExport(props);
  const { t } = exportState;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <FileImage className="h-5 w-5 text-primary" />
          {t('printBanner.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('printBanner.desc')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <PrintBannerTemplatePicker exportState={exportState} />
        <PrintBannerFieldsPanel exportState={exportState} />
      </CardContent>
    </Card>
  );
}
