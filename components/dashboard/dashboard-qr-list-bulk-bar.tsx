'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListBulkBar({ list }: { list: DashboardList }) {
  const { t, locale } = useLanguage();

  if (list.selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-sm font-medium">
        {t('dashboard.selectedCount', { count: formatLocaleNumber(list.selectedIds.length, locale) })}
      </span>
      <Button size="sm" variant="outline" onClick={() => list.runBulk('export')}>
        {t('dashboard.bulkExport')}
      </Button>
      <Button size="sm" variant="outline" onClick={list.runBulkZip} loading={list.zipExporting}>
        {t('dashboard.bulkExportZip')}
      </Button>
      <Button size="sm" variant="outline" onClick={() => list.runBulk('favorite')}>{t('dashboard.bulkFavorite')}</Button>
      <Button size="sm" variant="outline" onClick={() => list.runBulk('archive')}>{t('dashboard.bulkArchive')}</Button>
      {list.archivedFilter && (
        <Button size="sm" variant="outline" onClick={() => list.runBulk('unarchive')}>{t('dashboard.bulkRestore')}</Button>
      )}
      <Button size="sm" variant="destructive" onClick={() => list.runBulk('delete')}>{t('dashboard.bulkDelete')}</Button>
      <Button size="sm" variant="ghost" onClick={() => list.setSelectedIds([])}>{t('dashboard.bulkClear')}</Button>
    </div>
  );
}
