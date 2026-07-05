'use client';

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Loader2 } from 'lucide-react';
import { PrintBannerExport } from './print-banner-export';
import { EditableFrameLabel } from './editable-frame-label';
import { MockupPreview } from './mockup-preview';
import { ScanSimulation } from './scan-simulation';
import { QrPreviewExportPanel } from './qr-preview-export-panel';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { isPendingDynamicQr, resolveQrEncodeContent } from '@/lib/qr-preview-content';
import { useShowQrDescription } from '@/components/site-settings-provider';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrPreviewRender } from '@/hooks/use-qr-preview-render';
import {
  downloadQrFormat,
  printQrPreview,
  shareQrPreview,
  normalizeQRStyle,
  type QrExportFormat,
} from '@/lib/qr-export-actions';
import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryPrintLayout } from '@/lib/industry-print-layouts';

interface QRPreviewProps {
  category: string;
  qrData: Record<string, string>;
  style: Partial<QRStyleConfig> | Record<string, unknown>;
  logoPreview: string | null;
  shortCode?: string;
  qrName?: string;
  accentColor?: string;
  showExtras?: boolean;
  showScanTest?: boolean;
  showPrintBanner?: boolean;
  printLayout?: IndustryPrintLayout;
  industryTemplateId?: string;
  onStyleChange?: (style: QRStyleConfig) => void;
}

export function QRPreview({
  category,
  qrData,
  style,
  logoPreview,
  shortCode,
  qrName,
  accentColor,
  showPrintBanner,
  showExtras,
  showScanTest,
  printLayout,
  industryTemplateId,
  onStyleChange,
}: QRPreviewProps) {
  const { t } = useLanguage();
  const showQrDescription = useShowQrDescription();
  const containerRef = useRef<HTMLDivElement>(null);
  const [exportSize, setExportSize] = useState<number>(1024);
  const normalized = normalizeQRStyle(style);
  const scanBaseUrl = useScanBaseUrl();

  const qrDataKey = useMemo(() => JSON.stringify(qrData ?? {}), [qrData]);
  const pendingDynamic = isPendingDynamicQr(category, shortCode);

  const previewContent = useMemo(
    () =>
      resolveQrEncodeContent({
        category,
        qrData,
        shortCode,
        scanBaseUrl,
      }).content,
    [category, qrDataKey, shortCode, scanBaseUrl],
  );

  const { qrDataUrl, loading, error } = useQrPreviewRender({
    previewContent,
    normalized,
    logoPreview,
    onStyleChange,
    containerRef,
    renderErrorMessage: t('preview.renderError'),
  });

  const exportCtx = {
    previewContent,
    normalized,
    logoPreview,
    exportSize,
    pendingDynamic,
    qrDataUrl,
    shortCode,
    category,
    qrData,
    scanBaseUrl,
    qrName,
    t,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> {t('preview.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div
            className={`relative flex min-h-[300px] w-full items-center justify-center rounded-xl border p-4 ${
              onStyleChange && normalized.frameStyle === 'none' ? 'pb-12' : ''
            }`}
            style={{ backgroundColor: normalized.transparentBg ? 'transparent' : normalized.bgColor }}
          >
            {loading && (
              <Loader2 className="absolute h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!loading && error && (
              <p className="px-4 text-center text-sm text-muted-foreground">{error}</p>
            )}
            <div className="flex w-full min-w-0 items-center justify-center overflow-hidden">
              <div
                ref={containerRef}
                className={`relative inline-block max-w-full min-w-0 ${loading || error ? 'invisible' : ''}`}
              >
                {onStyleChange && !loading && !error && (
                  <EditableFrameLabel
                    style={normalized}
                    onChange={(patch) =>
                      onStyleChange(normalizeQRStyle({ ...normalized, ...patch }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {onStyleChange && showQrDescription && (
            <p className="w-full max-w-full px-1 text-center text-xs leading-snug text-muted-foreground">
              {t('style.frameLabelEditHint')}
            </p>
          )}

          <QrPreviewExportPanel
            exportSize={exportSize}
            onExportSizeChange={setExportSize}
            loading={loading}
            error={error}
            pendingDynamic={pendingDynamic}
            transparentBg={normalized.transparentBg}
            onDownload={(format: QrExportFormat) => downloadQrFormat(exportCtx, format)}
            onPrint={() => printQrPreview(exportCtx)}
            onShare={() => shareQrPreview(exportCtx)}
          />
        </CardContent>
      </Card>

      {(showScanTest || showExtras) && (
        <div className="space-y-3 rounded-xl border border-dashed border-border/60 p-3">
          {showExtras && (
            <p className="text-center text-xs text-muted-foreground">{t('scan.optionalExtras')}</p>
          )}
          {showExtras && <MockupPreview qrDataUrl={qrDataUrl} />}
          {(showScanTest || showExtras) && !pendingDynamic && (
            <ScanSimulation
              qrDataUrl={qrDataUrl}
              expectedContent={previewContent}
              style={normalized}
              hasLogo={!!logoPreview}
              contentLength={previewContent.length}
              defaultOpen={!!showScanTest && !showExtras}
            />
          )}
        </div>
      )}

      {showPrintBanner && shortCode && (
        <PrintBannerExport
          shortCode={shortCode}
          qrName={qrName}
          style={normalized}
          logoPreview={logoPreview}
          accentColor={accentColor}
          printLayout={printLayout}
          industryTemplateId={industryTemplateId}
        />
      )}
    </div>
  );
}
