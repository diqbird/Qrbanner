'use client';

import { useState } from 'react';
import type { ScanResult } from '@/lib/scan-simulation-types';
import type { ScannabilityResult } from '@/lib/scannability';
import { useScanSimulationCameraStream } from '@/hooks/use-scan-simulation-camera-stream';
import { useScanSimulationCameraLoop } from '@/hooks/use-scan-simulation-camera-loop';

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
  const [liveHits, setLiveHits] = useState(0);

  const stream = useScanSimulationCameraStream({ t, setResult, setLiveHits });

  useScanSimulationCameraLoop({
    videoRef: stream.videoRef,
    cameraOn: stream.cameraOn,
    liveScanning: stream.liveScanning,
    setLiveScanning: stream.setLiveScanning,
    expectedContent,
    scannability,
    t,
    setResult,
    setLiveHits,
  });

  return {
    videoRef: stream.videoRef,
    cameraOn: stream.cameraOn,
    liveScanning: stream.liveScanning,
    liveHits,
    startCamera: stream.startCamera,
    stopCamera: stream.stopCamera,
  };
}

export type ScanSimulationCameraState = ReturnType<typeof useScanSimulationCamera>;
