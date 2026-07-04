'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  QrCode, PlusCircle, TrendingUp, Eye, Search, Sparkles, ChevronLeft, ChevronRight,
  Star, Archive, Download, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardAnalyticsPanel } from './dashboard-analytics';
import { FolderManager } from './folder-manager';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { OnboardingBanner } from './onboarding-banner';
import { OnboardingChecklist } from './onboarding-checklist';
import { PlanUpgradeBanner } from './plan-upgrade-banner';
import { PwaInstallBanner } from '@/components/pwa/pwa-install-banner';
import { TopQrWidget } from './top-qr-widget';
import { CampaignsPanel } from './campaigns-panel';
import { QrListRow, type QRCodeItem } from './qr-list-row';
import { VirtualizedQrList } from './virtualized-qr-list';
import { DashboardPageSkeleton } from './dashboard-page-skeleton';
import { useLanguage } from '@/components/i18n/language-provider';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { QR_LIST_MAX_LIMIT } from '@/lib/qr-list-pagination';
import { useScanBaseUrl } from '@/lib/use-scan-base-url';
import { downloadBulkQrImagesZip, BULK_ZIP_MAX } from '@/lib/bulk-qr-zip-export';
import { Tag } from 'lucide-react';

interface ListMeta {
  labels: string[];
  batches: { id: string; name: string }[];
}

interface ListTotals {
  accountQrCount: number;
  accountActiveCount: number;
  accountTotalScans: number;
  filteredTotal: number;
  filteredScans: number;
  filteredActive: number;
}

interface ListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function DashboardContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [folders, setFolders] = useState<QRFolderOption[]>([]);
  const [meta, setMeta] = useState<ListMeta>({ labels: [], batches: [] });
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<ListTotals>({
    accountQrCount: 0,
    accountActiveCount: 0,
    accountTotalScans: 0,
    filteredTotal: 0,
    filteredScans: 0,
    filteredActive: 0,
  });
  const [pagination, setPagination] = useState<ListPagination>({
    page: 1,
    limit: QR_LIST_MAX_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [unfiledFilter, setUnfiledFilter] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 450);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchPending = searchQuery.trim() !== debouncedSearch.trim();
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [zipExporting, setZipExporting] = useState(false);
  const scanBaseUrl = useScanBaseUrl();

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchQRCodes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (unfiledFilter) params.set('unfiled', '1');
      else if (folderFilter) params.set('folderId', folderFilter);
      if (labelFilter) params.set('label', labelFilter);
      if (batchFilter) params.set('batchId', batchFilter);
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      if (favoritesFilter) params.set('favorites', '1');
      if (archivedFilter) params.set('archived', '1');
      params.set('page', String(page));
      params.set('limit', String(QR_LIST_MAX_LIMIT));

      const qs = params.toString();
      const res = await fetch(`/api/qr?${qs}`);
      if (res.ok) {
        const data = await res.json();
        const list: QRCodeItem[] = data?.qrCodes ?? [];
        setQrCodes(list);
        setMeta(data?.meta ?? { labels: [], batches: [] });
        if (data?.totals) setTotals(data.totals);
        if (data?.pagination) setPagination(data.pagination);
      }
    } catch {
      console.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, debouncedSearch, favoritesFilter, archivedFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, debouncedSearch, favoritesFilter, archivedFilter]);

  useEffect(() => {
    const batchFromUrl = searchParams.get('batchId');
    if (batchFromUrl) setBatchFilter(batchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    const focusSearch = () => searchInputRef.current?.focus();
    window.addEventListener('dashboard:focus-search', focusSearch);
    return () => window.removeEventListener('dashboard:focus-search', focusSearch);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchQRCodes();
  }, [fetchQRCodes]);

  const handleSelectFolder = (folderId: string | null, unfiled?: boolean) => {
    setFolderFilter(folderId);
    setUnfiledFilter(Boolean(unfiled));
    setBatchFilter(null);
    setLabelFilter(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(t('dashboard.deletedSuccess'));
        fetchQRCodes();
        fetchFolders();
      } else {
        toast.error(t('dashboard.deleteFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/qr/${id}?action=duplicate`, { method: 'POST' });
      if (res.ok) {
        toast.success(t('dashboard.duplicatedSuccess'));
        fetchQRCodes();
        fetchFolders();
      } else {
        toast.error(t('dashboard.duplicateFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const moveToFolder = async (qrId: string, folderId: string | null) => {
    try {
      const res = await fetch('/api/qr/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrIds: [qrId], folderId }),
      });
      if (!res.ok) return toast.error(t('dashboard.moveFailed'));
      toast.success(folderId ? t('dashboard.movedToFolder') : t('dashboard.removedFromFolder'));
      fetchQRCodes();
      fetchFolders();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const runBulk = async (action: string) => {
    if (!selectedIds.length) return;
    if (action === 'delete' && !confirm(t('dashboard.deleteBulkConfirm', { count: selectedIds.length }))) return;
    try {
      const res = await fetch('/api/qr/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (action === 'export' && res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qr-export.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success(t('dashboard.exportDownloaded'));
      } else if (res.ok) {
        toast.success(t('dashboard.bulkCompleted'));
        setSelectedIds([]);
        fetchQRCodes();
      } else {
        toast.error(t('dashboard.bulkFailed'));
      }
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const runBulkZip = async () => {
    if (!selectedIds.length) return;
    if (selectedIds.length > BULK_ZIP_MAX) {
      toast.error(t('dashboard.bulkZipTooMany', { max: BULK_ZIP_MAX }));
      return;
    }
    setZipExporting(true);
    try {
      const res = await fetch('/api/qr/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exportImagesMeta', ids: selectedIds }),
      });
      if (!res.ok) {
        toast.error(t('dashboard.bulkZipFailed'));
        return;
      }
      const { items } = await res.json();
      const count = await downloadBulkQrImagesZip(items ?? [], scanBaseUrl);
      toast.success(t('dashboard.bulkZipDownloaded', { count }));
    } catch {
      toast.error(t('dashboard.bulkZipFailed'));
    } finally {
      setZipExporting(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const res = await fetch('/api/qr/bulk-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: current ? 'unfavorite' : 'favorite', ids: [id] }),
    });
    if (res.ok) fetchQRCodes();
    else toast.error(t('dashboard.favoriteFailed'));
  };

  const clearFilters = () => {
    setFolderFilter(null);
    setUnfiledFilter(false);
    setLabelFilter(null);
    setBatchFilter(null);
    setSearchQuery('');
    setFavoritesFilter(false);
    setArchivedFilter(false);
  };

  const hasFilters = folderFilter || unfiledFilter || labelFilter || batchFilter || debouncedSearch.trim() || favoritesFilter || archivedFilter;

  const stats = hasFilters
    ? {
        total: totals.filteredTotal,
        totalScans: totals.filteredScans,
        active: totals.filteredActive,
      }
    : {
        total: totals.accountQrCount,
        totalScans: totals.accountTotalScans,
        active: totals.accountActiveCount,
      };

  const refreshFoldersAndList = () => {
    fetchQRCodes();
    fetchFolders();
  };

  const rangeFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeTo = Math.min(pagination.page * pagination.limit, pagination.total);

  if (loading && qrCodes.length === 0) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <OnboardingBanner show={!loading && totals.accountQrCount === 0} />

      <OnboardingChecklist qrCount={totals.accountQrCount} />

      <PlanUpgradeBanner />

      <PwaInstallBanner />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t('dashboard.totalQrCodes'), value: stats.total, icon: QrCode, color: 'text-primary' },
          { label: t('dashboard.totalScans'), value: stats.totalScans, icon: TrendingUp, color: 'text-green-500' },
          { label: t('dashboard.activeCodes'), value: stats.active, icon: Eye, color: 'text-blue-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            folders={folders}
            activeFolderId={folderFilter}
            unfiledActive={unfiledFilter}
            onSelectFolder={handleSelectFolder}
            onFoldersChange={() => { fetchFolders(); fetchQRCodes(); }}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder')}
                className="pl-9 pr-9"
                aria-busy={isSearchPending || (loading && Boolean(searchQuery.trim()))}
              />
              {(isSearchPending || (loading && Boolean(debouncedSearch.trim()))) && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
              )}
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t('dashboard.clearFilters')}
              </Button>
            )}
            <Button variant={favoritesFilter ? 'default' : 'outline'} size="sm" onClick={() => setFavoritesFilter(!favoritesFilter)} className="gap-1">
              <Star className="h-3.5 w-3.5" /> {t('dashboard.favorites')}
            </Button>
            <Button variant={archivedFilter ? 'default' : 'outline'} size="sm" onClick={() => setArchivedFilter(!archivedFilter)} className="gap-1">
              <Archive className="h-3.5 w-3.5" /> {t('dashboard.archive')}
            </Button>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
              <span className="text-sm font-medium">{t('dashboard.selectedCount', { count: selectedIds.length })}</span>
              <Button size="sm" variant="outline" onClick={() => runBulk('export')} className="gap-1"><Download className="h-3.5 w-3.5" /> {t('dashboard.bulkExport')}</Button>
              <Button size="sm" variant="outline" onClick={runBulkZip} loading={zipExporting} className="gap-1"><Download className="h-3.5 w-3.5" /> {t('dashboard.bulkExportZip')}</Button>
              <Button size="sm" variant="outline" onClick={() => runBulk('favorite')}>{t('dashboard.bulkFavorite')}</Button>
              <Button size="sm" variant="outline" onClick={() => runBulk('archive')}>{t('dashboard.bulkArchive')}</Button>
              {archivedFilter && (
                <Button size="sm" variant="outline" onClick={() => runBulk('unarchive')}>{t('dashboard.bulkRestore')}</Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => runBulk('delete')}>{t('dashboard.bulkDelete')}</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>{t('dashboard.bulkClear')}</Button>
            </div>
          )}

          {(meta.labels.length > 0 || meta.batches.length > 0) && (
            <div className="space-y-2">
              {meta.labels.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {t('dashboard.filterLabels')}
                  </span>
                  {meta.labels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setLabelFilter(labelFilter === label ? null : label)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                        labelFilter === label
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {meta.batches.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t('dashboard.filterBatches')}</span>
                  {meta.batches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBatchFilter(batchFilter === b.id ? null : b.id)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                        batchFilter === b.id
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
          {qrCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <QrCode className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="font-display text-lg font-semibold">
                {hasFilters ? t('dashboard.noMatchFilters') : t('dashboard.noQrYet')}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasFilters ? t('dashboard.tryAdjustFilters') : t('dashboard.noQrHint')}
              </p>
              {hasFilters ? (
                <Button className="mt-4" variant="outline" onClick={clearFilters}>{t('dashboard.clearFilters')}</Button>
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
                count={qrCodes.length}
                renderRow={(index) => {
                  const qr = qrCodes[index];
                  return (
                    <QrListRow
                      qr={qr}
                      selected={selectedIds.includes(qr.id)}
                      folders={folders}
                      onToggleSelect={toggleSelect}
                      onToggleFavorite={toggleFavorite}
                      onMoveToFolder={moveToFolder}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      onFoldersRefresh={refreshFoldersAndList}
                    />
                  );
                }}
              />

              {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.showingRange', { from: rangeFrom, to: rangeTo, total: pagination.total })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1 || loading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('dashboard.prevPage')}
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {t('dashboard.pageInfo', { page: pagination.page, totalPages: pagination.totalPages })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages || loading}
                      onClick={() => setPage((p) => p + 1)}
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
