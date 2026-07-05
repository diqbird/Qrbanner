'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScanResult } from '@/lib/scan-simulation-types';

export function useScanSimulationCameraStream({
  t,
  setResult,
  setLiveHits,
}: {
  t: (key: string, params?: Record<string, string | number>) => string;
  setResult: (r: ScanResult | null) => void;
  setLiveHits: React.Dispatch<React.SetStateAction<number>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [liveScanning, setLiveScanning] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setLiveScanning(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

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

  return {
    videoRef,
    cameraOn,
    liveScanning,
    setLiveScanning,
    startCamera,
    stopCamera,
  };
}
