'use client';

import { QRPreview } from './qr-preview';
import { ScannabilityPanel } from './scannability-panel';
import { normalizeQRStyle } from '@/lib/qr-style';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateDesignPreviewPanel({
  category,
  qrData,
  style,
  logoPreview,
  activeTemplate,
  landingPage,
  contentLength,
  onStyleChange,
}: Pick<
  QrCreateStepDesignProps,
  | 'category'
  | 'qrData'
  | 'style'
  | 'logoPreview'
  | 'activeTemplate'
  | 'landingPage'
  | 'contentLength'
  | 'onStyleChange'
>) {
  return (
    <div className="order-1 h-fit space-y-4 lg:order-2 lg:sticky lg:top-24">
      <QRPreview
        category={category}
        qrData={qrData}
        style={style}
        logoPreview={logoPreview}
        showScanTest
        printLayout={activeTemplate?.printLayout}
        industryTemplateId={activeTemplate?.id}
        accentColor={landingPage.accentColor}
        onStyleChange={(next) => onStyleChange(normalizeQRStyle(next))}
      />
      <ScannabilityPanel style={style} hasLogo={!!logoPreview} contentLength={contentLength} />
    </div>
  );
}
