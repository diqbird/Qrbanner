'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Loader2 } from 'lucide-react';
import { EditableFrameLabel } from './editable-frame-label';
import { QrPreviewExportPanel } from './qr-preview-export-panel';
import { useShowQrDescription } from '@/components/site-settings-provider';
import {
  downloadQrFormat,
  printQrPreview,
  shareQrPreview,
  type QrExportFormat,
} from '@/lib/qr-export-actions';
import type { QrPreviewState } from '@/hooks/use-qr-preview';

export function QrPreviewCanvas({ preview }: { preview: QrPreviewState }) {
  const {
    t,
    containerRef,
    exportSize,
    setExportSize,
    normalized,
    pendingDynamic,
    loading,
    error,
    exportCtx,
    onStyleChange,
    handleFrameLabelChange,
  } = preview;
  const showQrDescription = useShowQrDescription();

  return (
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
          {loading && <Loader2 className="absolute h-8 w-8 animate-spin text-muted-foreground" />}
          {!loading && error && (
            <p className="px-4 text-center text-sm text-muted-foreground">{error}</p>
          )}
          <div className="flex w-full min-w-0 items-center justify-center overflow-hidden">
            <div
              ref={containerRef}
              className={`relative inline-block max-w-full min-w-0 ${loading || error ? 'invisible' : ''}`}
            >
              {onStyleChange && !loading && !error && (
                <EditableFrameLabel style={normalized} onChange={handleFrameLabelChange} />
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
  );
}
