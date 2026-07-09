'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Download, Printer, Share2 } from 'lucide-react';
import { QR_EXPORT_SIZES, type QrExportFormat } from '@/lib/qr-export-actions';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';

type QrPreviewExportPanelProps = {
  exportSize: number;
  onExportSizeChange: (size: number) => void;
  loading: boolean;
  error: string | null;
  pendingDynamic: boolean;
  transparentBg: boolean;
  onDownload: (format: QrExportFormat) => void;
  onPrint: () => void;
  onShare: () => void;
};

function DisabledHint({
  disabled,
  hint,
  children,
}: {
  disabled: boolean;
  hint: string;
  children: React.ReactNode;
}) {
  if (!disabled) return <>{children}</>;
  return (
    <span className="inline-flex" title={hint}>
      {children}
    </span>
  );
}

export function QrPreviewExportPanel({
  exportSize,
  onExportSizeChange,
  loading,
  error,
  pendingDynamic,
  transparentBg,
  onDownload,
  onPrint,
  onShare,
}: QrPreviewExportPanelProps) {
  const { t, locale } = useLanguage();
  const disabled = loading || !!error || pendingDynamic;
  const hint = pendingDynamic ? t('preview.saveBeforeExport') : '';
  const sizeLabel = (sz: number) =>
    `${formatLocaleNumber(sz, locale)} × ${formatLocaleNumber(sz, locale)} px${sz >= 2048 ? ` (${t('preview.printQuality')})` : ''}`;

  return (
    <>
      <div className="w-full space-y-2">
        <Label className="text-xs text-muted-foreground">{t('preview.exportSize')}</Label>
        <Select value={String(exportSize)} onValueChange={(v) => onExportSizeChange(parseInt(v, 10))}>
          <SelectTrigger className="h-9">
            <SelectValue>{sizeLabel(exportSize)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {QR_EXPORT_SIZES.map((sz) => (
              <SelectItem key={sz} value={String(sz)}>
                {sizeLabel(sz)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {pendingDynamic && (
        <p
          className="w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-800 dark:text-amber-200"
          role="status"
        >
          {t('preview.pendingDynamicHint')}
        </p>
      )}

      <div id="qr-download-section" className="flex flex-wrap justify-center gap-2">
        {(['png', 'jpg', 'webp', 'svg', 'eps'] as const).map((format) => (
          <DisabledHint key={format} disabled={disabled && pendingDynamic} hint={hint}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(format)}
              className="min-h-9 gap-2"
              disabled={disabled}
              title={pendingDynamic ? hint : undefined}
              aria-describedby={pendingDynamic ? 'qr-export-pending-hint' : undefined}
            >
              <Download className="h-3.5 w-3.5" /> {format.toUpperCase()}
            </Button>
          </DisabledHint>
        ))}
        <DisabledHint disabled={disabled && pendingDynamic} hint={hint}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('pdf')}
            className="min-h-9 gap-2"
            disabled={disabled}
            title={pendingDynamic ? hint : undefined}
          >
            <Download className="h-3.5 w-3.5" /> {t('preview.pdf')}
          </Button>
        </DisabledHint>
        <DisabledHint disabled={disabled && pendingDynamic} hint={hint}>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="min-h-9 gap-2"
            disabled={disabled}
            title={pendingDynamic ? hint : undefined}
          >
            <Printer className="h-3.5 w-3.5" /> {t('preview.print')}
          </Button>
        </DisabledHint>
        <DisabledHint disabled={disabled && pendingDynamic} hint={hint}>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="min-h-9 gap-2"
            disabled={disabled}
            title={pendingDynamic ? hint : undefined}
          >
            <Share2 className="h-3.5 w-3.5" /> {t('preview.share')}
          </Button>
        </DisabledHint>
      </div>

      {pendingDynamic && (
        <p id="qr-export-pending-hint" className="sr-only">
          {t('preview.saveBeforeExport')}
        </p>
      )}

      {transparentBg && (
        <p className="text-center text-xs text-muted-foreground">{t('preview.transparentHint')}</p>
      )}
    </>
  );
}
