'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanLine } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { logoGuidanceVars } from '@/lib/qr-logo-guidance';
import { useScanSimulation } from '@/hooks/use-scan-simulation';
import type { QRStyleConfig } from '@/lib/qr-style';
import { ScanSimulationDigitalPanel } from './scan-simulation-digital-panel';
import { ScanSimulationCameraPanel } from './scan-simulation-camera-panel';
import { ScanSimulationResult } from './scan-simulation-result';

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
  const { locale } = useLanguage();
  const scan = useScanSimulation({
    qrDataUrl,
    expectedContent,
    style,
    hasLogo,
    contentLength,
    defaultOpen,
  });

  const { t, open, setOpen, result, scannability, dismissResult } = scan;
  const logoVars = logoGuidanceVars(locale);

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
            <ScanSimulationDigitalPanel scan={scan} />
            <ScanSimulationCameraPanel scan={scan} />
            {result && <ScanSimulationResult result={result} onDismiss={dismissResult} t={t} />}
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>• {t('scan.tipPrint', { dpi: formatLocaleNumber(scannability.printDpiRecommendation, locale) })}</li>
              <li>• {t('scan.tipLogo', { percent: logoVars.scanTipMax })}</li>
              <li>• {t('scan.tipFail')}</li>
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
