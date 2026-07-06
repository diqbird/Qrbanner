'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import type { ScanResult, ScanStatus } from '@/hooks/use-scan-simulation';

function statusIcon(status: ScanStatus) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === 'warn') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  if (status === 'fail') return <AlertTriangle className="h-4 w-4 text-destructive" />;
  return null;
}

type ScanSimulationResultProps = {
  result: ScanResult;
  onDismiss: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

export function ScanSimulationResult({ result, onDismiss, t }: ScanSimulationResultProps) {
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
              <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">{result.decoded}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
          aria-label={t('common.dismissAria')}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
