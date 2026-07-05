'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  decodeQrFromDataUrlRobust,
  decodeQrFromVideoFrame,
  payloadsMatch,
  type DecodeConfidence,
} from '@/lib/qr-scan-decode';
import { computeScannability } from '@/lib/scannability';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';

export type ScanStatus = 'idle' | 'running' | 'pass' | 'warn' | 'fail';

export interface ScanResult {
  status: ScanStatus;
  title: string;
  detail: string;
  decoded?: string;
  confidence?: DecodeConfidence;
}

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const autoRunRef = useRef<string | null>(null);

  const [open, setOpen] = useState(defaultOpen);
  const [cameraOn, setCameraOn] = useState(false);
  const [digitalRunning, setDigitalRunning] = useState(false);
  const [liveScanning, setLiveScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [liveHits, setLiveHits] = useState(0);

  const scannability = computeScannability(style ?? {}, {
    hasLogo,
    logoSize: style?.logoSize,
    contentLength,
  });

  const stopCamera = useCallback(() => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setLiveScanning(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const confidenceNote = (confidence: DecodeConfidence) => {
    if (confidence === 'high') return t('scan.confidenceHigh');
    if (confidence === 'medium') return t('scan.confidenceMedium');
    return t('scan.confidenceLow');
  };

  const evaluateDecode = useCallback(
    (decoded: string | null, source: 'digital' | 'camera', confidence?: DecodeConfidence): ScanResult => {
      if (!decoded) {
        return {
          status: 'fail',
          title: source === 'digital' ? t('scan.failDecode') : t('scan.failNoQr'),
          detail: source === 'digital' ? t('scan.failDecodeDetail') : t('scan.failNoQrDetail'),
        };
      }

      if (expectedContent && !payloadsMatch(decoded, expectedContent)) {
        return {
          status: 'warn',
          title: t('scan.warnPayload'),
          detail: `Decoded: ${decoded.slice(0, 120)}${decoded.length > 120 ? '…' : ''}`,
          decoded,
          confidence,
        };
      }

      const gradeNote =
        scannability.grade === 'A' || scannability.grade === 'B'
          ? t('scan.gradeGood')
          : t('scan.gradeWarn', { grade: scannability.grade });

      const dpiNote = t('scan.minDpi', { dpi: scannability.printDpiRecommendation });
      const confNote = confidence ? confidenceNote(confidence) : '';

      return {
        status: confidence === 'low' && source === 'digital' ? 'warn' : 'pass',
        title: source === 'digital' ? t('scan.passDigital') : t('scan.passCamera'),
        detail: [confNote, gradeNote, dpiNote].filter(Boolean).join(' '),
        decoded,
        confidence,
      };
    },
    [expectedContent, scannability.grade, scannability.printDpiRecommendation, t],
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

  const startCamera = async () => {
    setResult(null);
    setLiveHits(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setLiveScanning(true);
    } catch {
      setResult({
        status: 'fail',
        title: t('scan.failCamera'),
        detail: t('scan.failCameraDetail'),
      });
    }
  };

  useEffect(() => {
    if (!cameraOn || !liveScanning || !videoRef.current) return;

    let lastCheck = 0;
    const tick = async (ts: number) => {
      if (!videoRef.current || !liveScanning) return;
      if (ts - lastCheck > 250) {
        lastCheck = ts;
        try {
          const decoded = await decodeQrFromVideoFrame(videoRef.current);
          if (decoded) {
            setLiveHits((h) => h + 1);
            setResult(evaluateDecode(decoded, 'camera'));
            if (payloadsMatch(decoded, expectedContent ?? decoded)) {
              setLiveScanning(false);
            }
          }
        } catch {
          /* ignore frame errors */
        }
      }
      scanLoopRef.current = requestAnimationFrame(tick);
    };
    scanLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
    };
  }, [cameraOn, liveScanning, evaluateDecode, expectedContent]);

  const dismissResult = () => setResult(null);

  return {
    t,
    qrDataUrl,
    expectedContent,
    open,
    setOpen,
    cameraOn,
    digitalRunning,
    liveScanning,
    result,
    liveHits,
    scannability,
    videoRef,
    runDigitalTest,
    copyScanUrl,
    startCamera,
    stopCamera,
    dismissResult,
  };
}

export type ScanSimulationState = ReturnType<typeof useScanSimulation>;
