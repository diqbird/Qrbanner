'use client';

import { useEffect, useState } from 'react';

export function useScanBaseUrl(): string {
  const [base, setBase] = useState(
    typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com'
  );

  useEffect(() => {
    fetch('/api/domains')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.scan_base_url) setBase(data.scan_base_url.replace(/\/$/, ''));
      })
      .catch(() => undefined);
  }, []);

  return base;
}

export function buildScanLink(shortCode: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/s/${shortCode}`;
}
