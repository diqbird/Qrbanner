'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { ANALYTICS_RANGE_PRESETS, ANALYTICS_RANGE_PRESET_LABEL_KEY } from '@/lib/analytics-view-utils';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';

type AnalyticsViewHeaderProps = {
  analytics: QrAnalyticsState;
  showExport?: boolean;
};

export function AnalyticsViewHeader({ analytics, showExport = true }: AnalyticsViewHeaderProps) {
  const { t, locale, qrId, qrName, dateRange, setDateRange, applyPreset, handleExport, handleExportPdf } = analytics;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link href={`/qr/${qrId}`}>
          <Button variant="ghost" size="icon-sm">
            ←
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{t('analytics.analyticsTitle')}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{qrName}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {ANALYTICS_RANGE_PRESETS.map((days) => (
          <Button
            key={days}
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => applyPreset(days)}
          >
            {t(ANALYTICS_RANGE_PRESET_LABEL_KEY, { count: formatLocaleNumber(days, locale) })}
          </Button>
        ))}
        <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v ?? {})} />
        {showExport && (
          <>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" /> {t('analytics.exportCsv')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
              <Download className="h-4 w-4" /> {t('analytics.exportPdf')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
