'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  QrCode, PlusCircle, Search, Sparkles, ChevronLeft, ChevronRight,
  Star, Archive, Download, Loader2, Tag,
} from 'lucide-react';
import { DashboardAnalyticsPanel } from './dashboard-analytics';
import { FolderManager } from './folder-manager';
import { OnboardingBanner } from './onboarding-banner';
import { OnboardingChecklist } from './onboarding-checklist';
import { PlanUpgradeBanner } from './plan-upgrade-banner';
import { PwaInstallBanner } from '@/components/pwa/pwa-install-banner';
import { TopQrWidget } from './top-qr-widget';
import { CampaignsPanel } from './campaigns-panel';
import { QrListRow } from './qr-list-row';
import { VirtualizedQrList } from './virtualized-qr-list';
import { DashboardPageSkeleton } from './dashboard-page-skeleton';
import { DashboardStatsCards } from './dashboard-stats-cards';
import { useLanguage } from '@/components/i18n/language-provider';
import { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

export function DashboardContent() {
  const { t } = useLanguage();
  const list = useDashboardQrList();

  if (list.loading && list.qrCodes.length === 0) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <OnboardingBanner show={!list.loading && list.totals.accountQrCount === 0} />

      <OnboardingChecklist qrCount={list.totals.accountQrCount} />

      <PlanUpgradeBanner />

      <PwaInstallBanner />

      <DashboardStatsCards
        total={list.stats.total}
        totalScans={list.stats.totalScans}
        active={list.stats.active}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopQrWidget />
        <CampaignsPanel />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight mb-4">{t('dashboard.analyticsOverview')}</h2>
        <DashboardAnalyticsPanel />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="font-display text-lg">{t('dashboard.yourQrCodes')}</CardTitle>
            <div className="flex gap-2">
              <Link href="/qr/campaign">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('campaign.badge')}
                </Button>
              </Link>
              <Link href="/qr/bulk">
                <Button size="sm" variant="outline">{t('dashboard.bulkImport')}</Button>
              </Link>
              <Link href="/qr/create?quick=1">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" /> {t('dashboard.createNew')}
                </Button>
              </Link>
            </div>
          </div>

          <FolderManager
            folders={list.folders}
            activeFolderId={list.folderFilter}
            unfiledActive={list.unfiledFilter}
            onSelectFolder={list.handleSelectFolder}
            onFoldersChange={list.refreshFoldersAndList}
          />

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

          {list.selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
              <span className="text-sm font-medium">{t('dashboard.selectedCount', { count: list.selectedIds.length })}</span>
              <Button size="sm" variant="outline" onClick={() => list.runBulk('export')} className="gap-1">
                <Download className="h-3.5 w-3.5" /> {t('dashboard.bulkExport')}
              </Button>
              <Button size="sm" variant="outline" onClick={list.runBulkZip} loading={list.zipExporting} className="gap-1">
                <Download className="h-3.5 w-3.5" /> {t('dashboard.bulkExportZip')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => list.runBulk('favorite')}>{t('dashboard.bulkFavorite')}</Button>
              <Button size="sm" variant="outline" onClick={() => list.runBulk('archive')}>{t('dashboard.bulkArchive')}</Button>
              {list.archivedFilter && (
                <Button size="sm" variant="outline" onClick={() => list.runBulk('unarchive')}>{t('dashboard.bulkRestore')}</Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => list.runBulk('delete')}>{t('dashboard.bulkDelete')}</Button>
              <Button size="sm" variant="ghost" onClick={() => list.setSelectedIds([])}>{t('dashboard.bulkClear')}</Button>
            </div>
          )}

          {(list.meta.labels.length > 0 || list.meta.batches.length > 0) && (
            <div className="space-y-2">
              {list.meta.labels.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {t('dashboard.filterLabels')}
                  </span>
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
          )}
        </CardHeader>

        <CardContent>
          {list.qrCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <QrCode className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-display text-lg font-semibold">
                {list.hasFilters ? t('dashboard.noMatchFilters') : t('dashboard.noQrYet')}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {list.hasFilters ? t('dashboard.tryAdjustFilters') : t('dashboard.noQrHint')}
              </p>
              {list.hasFilters ? (
                <Button className="mt-4" variant="outline" onClick={list.clearFilters}>{t('dashboard.clearFilters')}</Button>
              ) : (
                <Link href="/qr/create?quick=1" className="mt-4">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> {t('dashboard.createQr')}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <VirtualizedQrList
                count={list.qrCodes.length}
                renderRow={(index) => {
                  const qr = list.qrCodes[index];
                  return (
                    <QrListRow
                      qr={qr}
                      selected={list.selectedIds.includes(qr.id)}
                      folders={list.folders}
                      onToggleSelect={list.toggleSelect}
                      onToggleFavorite={list.toggleFavorite}
                      onMoveToFolder={list.moveToFolder}
                      onDuplicate={list.handleDuplicate}
                      onDelete={list.handleDelete}
                      onFoldersRefresh={list.refreshFoldersAndList}
                    />
                  );
                }}
              />

              {list.pagination.totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.showingRange', {
                      from: list.rangeFrom,
                      to: list.rangeTo,
                      total: list.pagination.total,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={list.pagination.page <= 1 || list.loading}
                      onClick={() => list.setPage((p) => Math.max(1, p - 1))}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('dashboard.prevPage')}
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {t('dashboard.pageInfo', {
                        page: list.pagination.page,
                        totalPages: list.pagination.totalPages,
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={list.pagination.page >= list.pagination.totalPages || list.loading}
                      onClick={() => list.setPage((p) => p + 1)}
                      className="gap-1"
                    >
                      {t('dashboard.nextPage')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
