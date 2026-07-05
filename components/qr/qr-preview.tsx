'use client';

import { PrintBannerExport } from './print-banner-export';
import { QrPreviewCanvas } from './qr-preview-canvas';
import { QrPreviewExtras } from './qr-preview-extras';
import { useQrPreview } from '@/hooks/use-qr-preview';
import type { QRPreviewProps } from '@/lib/qr-preview-types';

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
  const preview = useQrPreview({
    category,
    qrData,
    style,
    logoPreview,
    shortCode,
    qrName,
    onStyleChange,
  });
  const { normalized } = preview;

  return (
    <div className="space-y-4">
      <QrPreviewCanvas preview={preview} />
      <QrPreviewExtras preview={preview} showExtras={showExtras} showScanTest={showScanTest} />
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
