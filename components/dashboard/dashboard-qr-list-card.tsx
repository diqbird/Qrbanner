'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, PlusCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { FolderManager } from './folder-manager';
import { QrListRow } from './qr-list-row';
import { VirtualizedQrList } from './virtualized-qr-list';
import { DashboardQrListToolbar } from './dashboard-qr-list-toolbar';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListCard({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  return (
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

        <DashboardQrListToolbar list={list} />
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
  );
}
