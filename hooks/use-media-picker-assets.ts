'use client';

import { useCallback, useEffect, useState } from 'react';

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
};

export function useMediaPickerAssets(open: boolean) {
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchAssets();
  }, [open, fetchAssets]);

  return { assets, loading };
}

export function mediaPickerFullUrl(url: string) {
  return url.startsWith('http') ? url : `${window.location.origin}${url}`;
}
