'use client';

import { Button } from '@/components/ui/button';
import { Link2, Monitor, ScanLine } from 'lucide-react';
import type { ScanSimulationState } from '@/hooks/use-scan-simulation';

type ScanSimulationDigitalPanelProps = {
  scan: ScanSimulationState;
};

export function ScanSimulationDigitalPanel({ scan }: ScanSimulationDigitalPanelProps) {
  const { t, qrDataUrl, digitalRunning, expectedContent, runDigitalTest, copyScanUrl } = scan;

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Monitor className="h-4 w-4 text-primary" /> {t('scan.digitalTitle')}
      </div>
      <p className="text-xs text-muted-foreground">{t('scan.digitalDesc')}</p>
      {qrDataUrl && (
        <div className="flex justify-center rounded-md bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR preview" className="max-h-32 w-auto" />
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="flex-1 gap-2"
          disabled={!qrDataUrl || digitalRunning}
          onClick={() => runDigitalTest()}
        >
          <ScanLine className="h-4 w-4" />
          {digitalRunning ? t('scan.decoding') : t('scan.runTest')}
        </Button>
        {expectedContent?.startsWith('http') && (
          <Button type="button" variant="outline" className="gap-2" onClick={copyScanUrl}>
            <Link2 className="h-4 w-4" /> {t('scan.copyLink')}
          </Button>
        )}
      </div>
      {digitalRunning && (
        <p className="text-center text-[10px] text-muted-foreground">{t('scan.autoTesting')}</p>
      )}
    </div>
  );
}
