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
