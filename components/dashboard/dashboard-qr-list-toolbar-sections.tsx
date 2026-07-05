'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Archive, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListSearchBar({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={list.searchInputRef}
          value={list.searchQuery}
          onChange={(e) => list.setSearchQuery(e.target.value)}
          placeholder={t('dashboard.searchPlaceholder')}
          className="pl-9 pr-9"
          aria-busy={list.isSearchPending || (list.loading && Boolean(list.searchQuery.trim()))}
        />
        {(list.isSearchPending || (list.loading && Boolean(list.debouncedSearch.trim()))) && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
        )}
      </div>
      {list.hasFilters && (
        <Button variant="ghost" size="sm" onClick={list.clearFilters}>
          {t('dashboard.clearFilters')}
        </Button>
      )}
      <Button
        variant={list.favoritesFilter ? 'default' : 'outline'}
        size="sm"
        onClick={() => list.setFavoritesFilter(!list.favoritesFilter)}
        className="gap-1"
      >
        <Star className="h-3.5 w-3.5" /> {t('dashboard.favorites')}
      </Button>
      <Button
        variant={list.archivedFilter ? 'default' : 'outline'}
        size="sm"
        onClick={() => list.setArchivedFilter(!list.archivedFilter)}
        className="gap-1"
      >
        <Archive className="h-3.5 w-3.5" /> {t('dashboard.archive')}
      </Button>
    </div>
  );
}

export function DashboardQrListBulkBar({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  if (list.selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-sm font-medium">{t('dashboard.selectedCount', { count: list.selectedIds.length })}</span>
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
