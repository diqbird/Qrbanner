'use client';

import { Button } from '@/components/ui/button';
import { Camera, Smartphone, X } from 'lucide-react';
import type { ScanSimulationState } from '@/hooks/use-scan-simulation';

type ScanSimulationCameraPanelProps = {
  scan: ScanSimulationState;
};

export function ScanSimulationCameraPanel({ scan }: ScanSimulationCameraPanelProps) {
  const { t, cameraOn, liveScanning, liveHits, videoRef, startCamera, stopCamera } = scan;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Smartphone className="h-4 w-4 text-primary" /> {t('scan.cameraTitle')}
      </div>
      <p className="text-xs text-muted-foreground">{t('scan.cameraDesc')}</p>
      {!cameraOn ? (
        <Button type="button" variant="outline" className="w-full gap-2" onClick={startCamera}>
          <Camera className="h-4 w-4" /> {t('scan.openCamera')}
        </Button>
      ) : (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-lg border-2 border-primary/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          {liveScanning && (
            <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/90 drop-shadow">
              {t('scan.scanning')}
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={stopCamera}
            aria-label={t('common.closeCameraAria')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {liveHits > 0 && cameraOn && (
        <p className="text-center text-xs text-muted-foreground">
          {t('scan.framesDecoded', { count: liveHits })}
        </p>
      )}
    </div>
  );
}
