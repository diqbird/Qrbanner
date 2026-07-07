'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, Printer } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { computeScannability, analyzePrintQuality, type ScannabilityFactorId } from '@/lib/scannability';
import type { QRStyleConfig } from '@/lib/qr-style';

export function ScannabilityPanel({
  style,
  hasLogo,
  contentLength,
}: {
  style: Partial<QRStyleConfig>;
  hasLogo?: boolean;
  contentLength?: number;
}) {
  const { t } = useLanguage();
  const result = computeScannability(style, { hasLogo, logoSize: style.logoSize, contentLength });
  const print = analyzePrintQuality(style, 1024, hasLogo);

  const gradeColor =
    result.grade === 'A' ? 'bg-green-500' : result.grade === 'B' ? 'bg-emerald-500' : result.grade === 'C' ? 'bg-amber-500' : 'bg-red-500';

  const factorTip = (id: ScannabilityFactorId) =>
    t(`scannability.factors.${id}` as 'scannability.factors.lowContrast');

  const printMessage = print.ok
    ? t('scannability.printOk', { dpi: print.printDpi, cm: print.physicalCm.toFixed(1) })
    : t('scannability.printWarn', { minCm: print.minPrintCm, dpi: print.printDpi });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" /> {t('scannability.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white ${gradeColor}`}>
            {result.grade}
          </div>
          <div>
            <p className="text-2xl font-bold font-display">{result.score}/100</p>
            <p className="text-xs text-muted-foreground">{t('scannability.scoreHint')}</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${result.score}%` }} />
        </div>
        <ul className="space-y-2 text-sm">
          {result.factors.slice(0, 4).map((f) => (
            <li key={f.id} className="flex gap-2">
              <Badge variant={f.impact < 0 ? 'destructive' : 'secondary'} className="shrink-0 text-[10px]">
                {f.impact < 0 ? f.impact : t('scannability.factorOk')}
              </Badge>
              <span className="text-muted-foreground">{factorTip(f.id)}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-lg border p-3 text-xs flex gap-2">
          <Printer className="h-4 w-4 shrink-0 text-primary" />
          <span>{printMessage}</span>
        </div>
      </CardContent>
    </Card>
  );
}
