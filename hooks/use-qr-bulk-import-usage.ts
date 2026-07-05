'use client';

import { useEffect, useState } from 'react';
import { defaultBulkUsage, type UsageInfo } from '@/lib/qr-bulk-import-types';

export function useQrBulkImportUsage() {
  const [usage, setUsage] = useState<UsageInfo>(defaultBulkUsage);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.usage) return;
        setUsage({
          maxBulkRows: data.usage.bulkRowLimit ?? 100,
          qrLimit: data.usage.qrLimit ?? 25,
          qrCodes: data.usage.qrCodes ?? 0,
          planName: data.plan?.name ?? 'Free',
        });
      })
      .catch(() => undefined);
  }, []);

  const maxRows = usage.maxBulkRows;
  const slotsLeft = Math.max(0, usage.qrLimit - usage.qrCodes);

  return { usage, maxRows, slotsLeft };
}
