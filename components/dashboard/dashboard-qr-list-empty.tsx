'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardQrListEmpty({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
      <QrCode className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h3 className="font-display text-lg font-semibold">
        {list.hasFilters ? t('dashboard.noMatchFilters') : t('dashboard.noQrYet')}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {list.hasFilters ? t('dashboard.tryAdjustFilters') : t('dashboard.noQrHint')}
      </p>
      {list.hasFilters ? (
        <Button className="mt-4" variant="outline" onClick={list.clearFilters}>
          {t('dashboard.clearFilters')}
        </Button>
      ) : (
        <Link href="/qr/create?quick=1" className="mt-4">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> {t('dashboard.createQr')}
          </Button>
        </Link>
      )}
    </div>
  );
}
