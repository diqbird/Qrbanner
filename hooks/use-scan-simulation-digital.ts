'use client';

import { useCallback, useEffect, useRef } from 'react';
import { decodeQrFromDataUrlRobust } from '@/lib/qr-scan-decode';
import { evaluateScanDecode } from '@/lib/scan-simulation-evaluate';
import type { ScanResult } from '@/lib/scan-simulation-types';
import type { ScannabilityResult } from '@/lib/scannability';

type Translate = (key: string) => string;

export function useScanSimulationDigital({
  qrDataUrl,
  open,
  expectedContent,
  scannability,
  t,
  setResult,
  setDigitalRunning,
}: {
  qrDataUrl: string | null;
  open: boolean;
  expectedContent?: string;
  scannability: ScannabilityResult;
  t: Translate;
  setResult: (result: ScanResult | null) => void;
  setDigitalRunning: (running: boolean) => void;
}) {
  const autoRunRef = useRef<string | null>(null);

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
    [qrDataUrl, evaluateDecode, t, setResult, setDigitalRunning],
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

  return { runDigitalTest };
}
