'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { decodeQrFromDataUrlRobust } from '@/lib/qr-scan-decode';
import { computeScannability } from '@/lib/scannability';
import { evaluateScanDecode } from '@/lib/scan-simulation-evaluate';
import { useScanSimulationCamera } from '@/hooks/use-scan-simulation-camera';
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
  const { t } = useLanguage();
  const autoRunRef = useRef<string | null>(null);

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
    setResult,
  });

  const evaluateDecode = useCallback(
    (decoded: string | null, source: 'digital' | 'camera', confidence?: import('@/lib/qr-scan-decode').DecodeConfidence) =>
      evaluateScanDecode({ decoded, source, confidence, expectedContent, scannability, t }),
    [expectedContent, scannability, t],
  );

  const runDigitalTest = useCallback(
    async (silent = false) => {
      if (!qrDataUrl) return;
      setDigitalRunning(true);
      if (!silent) setResult(null);
      try {
        const { decoded, confidence } = await decodeQrFromDataUrlRobust(qrDataUrl);
        setResult(evaluateDecode(decoded, 'digital', confidence));
      } catch {
        setResult({
          status: 'fail',
          title: t('scan.failError'),
          detail: t('scan.failErrorDetail'),
        });
      } finally {
        setDigitalRunning(false);
      }
    },
    [qrDataUrl, evaluateDecode, t],
  );

  useEffect(() => {
    if (!open || !qrDataUrl) return;
    if (autoRunRef.current === qrDataUrl) return;
    const timer = window.setTimeout(() => {
      autoRunRef.current = qrDataUrl;
      runDigitalTest(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [open, qrDataUrl, runDigitalTest]);

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
