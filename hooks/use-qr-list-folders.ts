'use client';

import { useCallback, useEffect, useState } from 'react';
import type { QRFolderOption } from '@/lib/qr-organize-types';

export function useQrListFolders() {
  const [folders, setFolders] = useState<QRFolderOption[]>([]);

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

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return { folders, fetchFolders };
}
