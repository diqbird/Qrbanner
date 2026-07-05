'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import type { QRCodeItem } from '@/lib/qr-list-row-types';

export function QrListRowScanCount({ qr }: { qr: QRCodeItem }) {
  const { t } = useLanguage();

  return (
    <div className="hidden text-right sm:block">
      <p className="font-mono text-sm font-semibold">{qr.totalScans}</p>
      <p className="text-xs text-muted-foreground">{t('dashboard.scansLabel')}</p>
    </div>
  );
}
