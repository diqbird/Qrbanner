'use client';

import { useMemo, useRef, useState } from 'react';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { isPendingDynamicQr, resolveQrEncodeContent } from '@/lib/qr-preview-content';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrPreviewRender } from '@/hooks/use-qr-preview-render';
import { normalizeQRStyle } from '@/lib/qr-export-actions';
import type { QRPreviewProps } from '@/lib/qr-preview-types';
import type { QRStyleConfig } from '@/lib/qr-style';

export function useQrPreview({
  category,
  qrData,
  style,
  logoPreview,
  shortCode,
  qrName,
  onStyleChange,
}: Pick<
  QRPreviewProps,
  'category' | 'qrData' | 'style' | 'logoPreview' | 'shortCode' | 'qrName' | 'onStyleChange'
>) {
  const { t, locale } = useLanguage();
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
    locale,
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
    locale,
  };

  const handleFrameLabelChange = (patch: Partial<QRStyleConfig>) => {
    if (!onStyleChange) return;
    onStyleChange(normalizeQRStyle({ ...normalized, ...patch }));
  };

  return {
    t,
    containerRef,
    exportSize,
    setExportSize,
    normalized,
    pendingDynamic,
    previewContent,
    qrDataUrl,
    loading,
    error,
    exportCtx,
    onStyleChange,
    handleFrameLabelChange,
  };
}

export type QrPreviewState = ReturnType<typeof useQrPreview>;
