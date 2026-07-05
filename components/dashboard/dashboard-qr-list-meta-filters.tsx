'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListMetaFilters({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  if (list.meta.labels.length === 0 && list.meta.batches.length === 0) return null;

  return (
    <div className="space-y-2">
      {list.meta.labels.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('dashboard.filterLabels')}</span>
          {list.meta.labels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => list.setLabelFilter(list.labelFilter === label ? null : label)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                list.labelFilter === label
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {list.meta.batches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('dashboard.filterBatches')}</span>
          {list.meta.batches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => list.setBatchFilter(list.batchFilter === b.id ? null : b.id)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                list.batchFilter === b.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
