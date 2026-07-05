'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListPagination({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  if (list.pagination.totalPages <= 1) return null;

  return (
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
  );
}
