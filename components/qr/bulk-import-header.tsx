'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';
import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';

type BulkImportHeaderProps = {
  bulk: QrBulkImportState;
};

export function BulkImportHeader({ bulk }: BulkImportHeaderProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { t, maxRows, usage, slotsLeft } = bulk;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> {t('bulk.back')}
      </Button>
      <div>
        <h1 className="font-display text-2xl font-bold">{t('bulk.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('bulk.subtitle', { max: formatLocaleNumber(maxRows, locale) })} ·{' '}
          {resolvePlanDisplayName(usage.planId, locale)}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('bulk.slotsLeft', {
            remaining: formatLocaleNumber(slotsLeft, locale),
            limit: formatLocaleNumber(usage.qrLimit, locale),
          })}
        </p>
      </div>
    </div>
  );
}
