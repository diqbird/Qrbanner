'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { ANALYTICS_RANGE_PRESETS, ANALYTICS_RANGE_PRESET_LABEL_KEY } from '@/lib/analytics-view-utils';
import type { DashboardAnalyticsState } from '@/hooks/use-dashboard-analytics';

type DashboardAnalyticsToolbarProps = {
  analytics: DashboardAnalyticsState;
};

export function DashboardAnalyticsToolbar({ analytics }: DashboardAnalyticsToolbarProps) {
  const { t, locale, dateRange, setDateRange, applyPreset, handleExportCsv, handleExportPdf } = analytics;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
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
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCsv}>
          <Download className="h-4 w-4" /> {t('analytics.exportCsv')}
        </Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPdf}>
          <Download className="h-4 w-4" /> {t('analytics.exportPdf')}
        </Button>
      </div>
    </div>
  );
}
