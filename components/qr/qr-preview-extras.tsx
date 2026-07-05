'use client';

import { MockupPreview } from './mockup-preview';
import { ScanSimulation } from './scan-simulation';
import type { QrPreviewState } from '@/hooks/use-qr-preview';
import type { QRStyleConfig } from '@/lib/qr-style';

export function QrPreviewExtras({
  preview,
  showExtras,
  showScanTest,
}: {
  preview: QrPreviewState;
  showExtras?: boolean;
  showScanTest?: boolean;
}) {
  const { t, qrDataUrl, previewContent, normalized, pendingDynamic } = preview;

  if (!showScanTest && !showExtras) return null;

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-border/60 p-3">
      {showExtras && (
        <p className="text-center text-xs text-muted-foreground">{t('scan.optionalExtras')}</p>
      )}
      {showExtras && <MockupPreview qrDataUrl={qrDataUrl} />}
      {(showScanTest || showExtras) && !pendingDynamic && (
        <ScanSimulation
          qrDataUrl={qrDataUrl}
          expectedContent={previewContent}
          style={normalized as QRStyleConfig}
          hasLogo={!!preview.exportCtx.logoPreview}
          contentLength={previewContent.length}
          defaultOpen={!!showScanTest && !showExtras}
        />
      )}
    </div>
  );
}
