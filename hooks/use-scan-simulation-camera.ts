'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { decodeQrFromVideoFrame, payloadsMatch } from '@/lib/qr-scan-decode';
import { evaluateScanDecode } from '@/lib/scan-simulation-evaluate';
import type { ScanResult } from '@/lib/scan-simulation-types';
import type { ScannabilityResult } from '@/lib/scannability';

type Translate = (key: string, params?: Record<string, string | number>) => string;

export function useScanSimulationCamera({
  expectedContent,
  scannability,
  t,
  setResult,
}: {
  expectedContent?: string;
  scannability: ScannabilityResult;
  t: Translate;
  setResult: (r: ScanResult | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [liveScanning, setLiveScanning] = useState(false);
  const [liveHits, setLiveHits] = useState(0);

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

  const evaluateDecode = useCallback(
    (decoded: string | null, source: 'digital' | 'camera', confidence?: import('@/lib/qr-scan-decode').DecodeConfidence) =>
      evaluateScanDecode({ decoded, source, confidence, expectedContent, scannability, t }),
    [expectedContent, scannability, t],
  );

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
  }, [cameraOn, liveScanning, evaluateDecode, expectedContent, setResult]);

  return {
    videoRef,
    cameraOn,
    liveScanning,
    liveHits,
    startCamera,
    stopCamera,
  };
}

export type ScanSimulationCameraState = ReturnType<typeof useScanSimulationCamera>;
