'use client';

import { useEffect, useRef } from 'react';
import { decodeQrFromVideoFrame, payloadsMatch } from '@/lib/qr-scan-decode';
import type { ScanResult } from '@/lib/scan-simulation-types';
import type { ScannabilityResult } from '@/lib/scannability';
import { evaluateScanDecode } from '@/lib/scan-simulation-evaluate';

type Translate = (key: string, params?: Record<string, string | number>) => string;

export function useScanSimulationCameraLoop({
  videoRef,
  cameraOn,
  liveScanning,
  setLiveScanning,
  expectedContent,
  scannability,
  t,
  setResult,
  setLiveHits,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraOn: boolean;
  liveScanning: boolean;
  setLiveScanning: (scanning: boolean) => void;
  expectedContent?: string;
  scannability: ScannabilityResult;
  t: Translate;
  setResult: (r: ScanResult | null) => void;
  setLiveHits: React.Dispatch<React.SetStateAction<number>>;
}) {
  const scanLoopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!cameraOn || !liveScanning || !videoRef.current) return;

    let lastCheck = 0;
    const evaluateDecode = (
      decoded: string | null,
      source: 'digital' | 'camera',
      confidence?: import('@/lib/qr-scan-decode').DecodeConfidence,
    ) => evaluateScanDecode({ decoded, source, confidence, expectedContent, scannability, t });

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
  }, [cameraOn, liveScanning, expectedContent, scannability, t, setResult, setLiveHits, setLiveScanning, videoRef]);
}
