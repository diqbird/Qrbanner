'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { QRCodeItem } from '@/lib/qr-list-row-types';

export function QrListRowScanCount({ qr }: { qr: QRCodeItem }) {
  const { t, locale } = useLanguage();

  return (
    <div className="hidden text-right sm:block">
      <p className="font-mono text-sm font-semibold">{formatLocaleNumber(qr.totalScans, locale)}</p>
      <p className="text-xs text-muted-foreground">{t('dashboard.scansLabel')}</p>
    </div>
  );
}
