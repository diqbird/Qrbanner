'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Sparkles } from 'lucide-react';
import { FolderManager } from './folder-manager';
import { QrListRow } from './qr-list-row';
import { VirtualizedQrList } from './virtualized-qr-list';
import { DashboardQrListToolbar } from './dashboard-qr-list-toolbar';
import { DashboardQrListEmpty } from './dashboard-qr-list-empty';
import { DashboardQrListPagination } from './dashboard-qr-list-pagination';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListCard({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  return (
    <Card className="surface-3d border-white/30 bg-card/80 backdrop-blur-md dark:border-white/10">
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="font-display text-lg">{t('dashboard.yourQrCodes')}</CardTitle>
          <div className="flex gap-2">
            <Link href="/qr/campaign">
              <Button size="sm" variant="outline" className="gap-1.5 rounded-xl border-white/25 bg-background/40">
                <Sparkles className="h-3.5 w-3.5" />
                {t('campaign.badge')}
              </Button>
            </Link>
            <Link href="/qr/bulk">
              <Button size="sm" variant="outline" className="rounded-xl border-white/25 bg-background/40">
                {t('dashboard.bulkImport')}
              </Button>
            </Link>
            <Link href="/qr/create?quick=1">
              <Button size="sm" className="gap-2 rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]">
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
          <DashboardQrListEmpty list={list} />
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
            <DashboardQrListPagination list={list} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
