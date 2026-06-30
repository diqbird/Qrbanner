'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  ScanLine,
  X,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Monitor,
  Link2,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  decodeQrFromDataUrlRobust,
  decodeQrFromVideoFrame,
  payloadsMatch,
  type DecodeConfidence,
} from '@/lib/qr-scan-decode';
import { computeScannability } from '@/lib/scannability';
import type { QRStyleConfig } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { toast } from 'sonner';

type ScanStatus = 'idle' | 'running' | 'pass' | 'warn' | 'fail';

interface ScanResult {
  status: ScanStatus;
  title: string;
  detail: string;
  decoded?: string;
  confidence?: DecodeConfidence;
}

export function ScanSimulation({
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
    (
      decoded: string | null,
      source: 'digital' | 'camera',
      confidence?: DecodeConfidence
    ): ScanResult => {
      if (!decoded) {
        return {
          status: 'fail',
          title: source === 'digital' ? t('scan.failDecode') : t('scan.failNoQr'),
          detail:
            source === 'digital' ? t('scan.failDecodeDetail') : t('scan.failNoQrDetail'),
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
    [expectedContent, scannability.grade, scannability.printDpiRecommendation, t]
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
    [qrDataUrl, evaluateDecode, t]
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

  const statusIcon = (status: ScanStatus) => {
    if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === 'warn') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    if (status === 'fail') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    return null;
  };

  const statusBadge = (status: ScanStatus) => {
    if (status === 'pass') return <Badge className="bg-green-600">{t('scan.badgePass')}</Badge>;
    if (status === 'warn')
      return (
        <Badge variant="secondary" className="bg-amber-500 text-white">
          {t('scan.badgeCheck')}
        </Badge>
      );
    if (status === 'fail') return <Badge variant="destructive">{t('scan.badgeFail')}</Badge>;
    return null;
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <ScanLine className="h-4 w-4 text-primary" /> {t('scan.title')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {t('scan.grade')} {scannability.grade}
              </Badge>
              <CollapsibleTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                  {open ? t('scan.hide') : t('scan.show')}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t('scan.subtitle')}</p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
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
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={copyScanUrl}
                  >
                    <Link2 className="h-4 w-4" /> {t('scan.copyLink')}
                  </Button>
                )}
              </div>
              {digitalRunning && (
                <p className="text-center text-[10px] text-muted-foreground">{t('scan.autoTesting')}</p>
              )}
            </div>

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
                    aria-label="Close camera"
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

            {result && (
              <div
                className={`rounded-lg border p-3 ${
                  result.status === 'pass'
                    ? 'border-green-500/40 bg-green-500/5'
                    : result.status === 'warn'
                      ? 'border-amber-500/40 bg-amber-500/5'
                      : 'border-destructive/40 bg-destructive/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {statusIcon(result.status)}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{result.title}</p>
                        {statusBadge(result.status)}
                        {result.confidence && (
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {result.confidence}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{result.detail}</p>
                      {result.decoded && (
                        <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">
                          {result.decoded}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setResult(null)}
                    aria-label="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>• {t('scan.tipPrint', { dpi: scannability.printDpiRecommendation })}</li>
              <li>• {t('scan.tipLogo')}</li>
              <li>• {t('scan.tipFail')}</li>
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
