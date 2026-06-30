'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  QrCode, PlusCircle, BarChart3, Eye, Trash2, Copy,
  ExternalLink, MoreHorizontal, Pencil, TrendingUp, Search, FolderOpen, Tag,
  Star, Archive, Download,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DashboardAnalyticsPanel } from './dashboard-analytics';
import { FolderManager, MoveToFolderMenu } from './folder-manager';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { categoryShortName } from '@/lib/qr-utils';
import { OnboardingBanner } from './onboarding-banner';
import { OnboardingChecklist } from './onboarding-checklist';
import { PlanUpgradeBanner } from './plan-upgrade-banner';
import { TopQrWidget } from './top-qr-widget';
import { CampaignsPanel } from './campaigns-panel';
import { useLanguage } from '@/components/i18n/language-provider';

interface QRCodeItem {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  isActive: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  totalScans: number;
  batchId?: string | null;
  batchLabel?: string | null;
  folderId?: string | null;
  labels?: string[];
  folder?: { id: string; name: string; color: string } | null;
  createdAt: string;
}

interface ListMeta {
  labels: string[];
  batches: { id: string; name: string }[];
}

export function DashboardContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [folders, setFolders] = useState<QRFolderOption[]>([]);
  const [meta, setMeta] = useState<ListMeta>({ labels: [], batches: [] });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalScans: 0, active: 0 });
  const [accountQrTotal, setAccountQrTotal] = useState<number | null>(null);

  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [unfiledFilter, setUnfiledFilter] = useState(false);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (favoritesFilter) params.set('favorites', '1');
      if (archivedFilter) params.set('archived', '1');

      const qs = params.toString();
      const res = await fetch(`/api/qr${qs ? `?${qs}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        const list: QRCodeItem[] = data?.qrCodes ?? [];
        setQrCodes(list);
        setMeta(data?.meta ?? { labels: [], batches: [] });
        setStats({
          total: list.length,
          totalScans: list.reduce((sum, qr) => sum + (qr?.totalScans ?? 0), 0),
          active: list.filter((qr) => qr?.isActive).length,
        });
      }
    } catch {
      console.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  }, [folderFilter, unfiledFilter, labelFilter, batchFilter, searchQuery, favoritesFilter, archivedFilter]);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.usage?.qrCodes != null) setAccountQrTotal(data.usage.qrCodes);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const batchFromUrl = searchParams.get('batchId');
    if (batchFromUrl) setBatchFilter(batchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

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

  const hasFilters = folderFilter || unfiledFilter || labelFilter || batchFilter || searchQuery.trim() || favoritesFilter || archivedFilter;

  if (loading && qrCodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <OnboardingBanner show={!loading && (accountQrTotal ?? stats.total) === 0} />

      <OnboardingChecklist qrCount={accountQrTotal ?? stats.total} />

      <PlanUpgradeBanner />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t('dashboard.totalQrCodes'), value: stats.total, icon: QrCode, color: 'text-primary' },
          { label: t('dashboard.totalScans'), value: stats.totalScans, icon: TrendingUp, color: 'text-green-500' },
          { label: t('dashboard.activeCodes'), value: stats.active, icon: Eye, color: 'text-blue-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
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
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopQrWidget items={qrCodes} />
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder')}
                className="pl-9"
              />
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
                <Button className="mt-4" variant="outline" onClick={clearFilters}>Clear filters</Button>
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
              {qrCodes.map((qr, i) => (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(qr.id)}
                      onChange={() => toggleSelect(qr.id)}
                      className="h-4 w-4 rounded border-border"
                      aria-label={`Select ${qr.name}`}
                    />
                    <button type="button" onClick={() => toggleFavorite(qr.id, !!qr.isFavorite)} className="shrink-0 text-muted-foreground hover:text-amber-500">
                      <Star className={`h-4 w-4 ${qr.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: qr.folder ? `${qr.folder.color}20` : undefined }}
                    >
                      <QrCode className="h-5 w-5" style={{ color: qr.folder?.color ?? undefined }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{qr.name}</h4>
                        <Badge variant={qr.isActive ? 'default' : 'secondary'} className="text-xs">
                          {qr.isArchived ? t('dashboard.statusArchived') : qr.isActive ? t('dashboard.statusActive') : t('dashboard.statusInactive')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{categoryShortName(qr.category)}</Badge>
                        {qr.folder && (
                          <Badge
                            variant="secondary"
                            className="text-xs gap-1"
                            style={{ borderColor: qr.folder.color }}
                          >
                            <FolderOpen className="h-3 w-3" style={{ color: qr.folder.color }} />
                            {qr.folder.name}
                          </Badge>
                        )}
                        {qr.batchLabel && (
                          <Badge variant="secondary" className="text-xs">{qr.batchLabel}</Badge>
                        )}
                        {(qr.labels ?? []).map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">{label}</Badge>
                        ))}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground max-w-[320px]">
                        {qr.targetUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden text-right sm:block">
                      <p className="font-mono text-sm font-semibold">{qr.totalScans}</p>
                      <p className="text-xs text-muted-foreground">scans</p>
                    </div>
                    <MoveToFolderMenu
                      qrId={qr.id}
                      folders={folders}
                      currentFolderId={qr.folderId}
                      onMoved={() => { fetchQRCodes(); fetchFolders(); }}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/s/${qr.shortCode}`, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/qr/${qr.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/qr/${qr.id}/analytics`}>
                            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <FolderOpen className="mr-2 h-4 w-4" /> Move to folder
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => moveToFolder(qr.id, null)} disabled={!qr.folderId}>
                              Remove from folder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {folders.map((f) => (
                              <DropdownMenuItem
                                key={f.id}
                                onClick={() => moveToFolder(qr.id, f.id)}
                                disabled={qr.folderId === f.id}
                              >
                                {f.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => handleDuplicate(qr.id)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(qr.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
