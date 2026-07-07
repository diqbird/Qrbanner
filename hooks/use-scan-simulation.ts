'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { computeScannability } from '@/lib/scannability';
import { useScanSimulationCamera } from '@/hooks/use-scan-simulation-camera';
import { useScanSimulationDigital } from '@/hooks/use-scan-simulation-digital';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';

export type { ScanStatus, ScanResult } from '@/lib/scan-simulation-types';

export function useScanSimulation({
  qrDataUrl,
  expectedContent,
  style,
  hasLogo,
  contentLength,
  defaultOpen = false,
}: {
  qrDataUrl: string | null;
  expectedContent?: string;
  style?: Partial<QRStyleConfig>;
  hasLogo?: boolean;
  contentLength?: number;
  defaultOpen?: boolean;
}) {
  const { t, locale } = useLanguage();

  const [open, setOpen] = useState(defaultOpen);
  const [digitalRunning, setDigitalRunning] = useState(false);
  const [result, setResult] = useState<import('@/lib/scan-simulation-types').ScanResult | null>(null);

  const scannability = computeScannability(style ?? {}, {
    hasLogo,
    logoSize: style?.logoSize,
    contentLength,
  });

  const camera = useScanSimulationCamera({
    expectedContent,
    scannability,
    t,
    locale,
    setResult,
  });

  const { runDigitalTest } = useScanSimulationDigital({
    qrDataUrl,
    open,
    expectedContent,
    scannability,
    t,
    locale,
    setResult,
    setDigitalRunning,
  });

  const copyScanUrl = async () => {
    if (!expectedContent?.startsWith('http')) return;
    try {
      await navigator.clipboard.writeText(expectedContent);
      toast.success(t('scan.linkCopied'));
    } catch {
      toast.error(t('scan.copyFailed'));
    }
  };

  const dismissResult = () => setResult(null);

  return {
    t,
    qrDataUrl,
    expectedContent,
    open,
    setOpen,
    cameraOn: camera.cameraOn,
    digitalRunning,
    liveScanning: camera.liveScanning,
    result,
    liveHits: camera.liveHits,
    scannability,
    videoRef: camera.videoRef,
    runDigitalTest,
    copyScanUrl,
    startCamera: camera.startCamera,
    stopCamera: camera.stopCamera,
    dismissResult,
  };
}

export type ScanSimulationState = ReturnType<typeof useScanSimulation>;
