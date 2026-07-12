'use client';

import { useEffect, useState } from 'react';
import {
  parseInviteTokenFromCallback,
  type InviteAuthBrand,
} from '@/lib/invite-brand';

export function useInviteAuthBrand(callbackUrl: string): InviteAuthBrand | null {
  const token = parseInviteTokenFromCallback(callbackUrl);
  const [brand, setBrand] = useState<InviteAuthBrand | null>(null);

  useEffect(() => {
    if (!token) {
      setBrand(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/invite/${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.branding) {
          if (!cancelled) setBrand(null);
          return;
        }
        setBrand({
          agencyName: data.branding.agencyName ?? null,
          logoUrl: data.branding.logoUrl ?? null,
          faviconUrl: data.branding.faviconUrl ?? null,
          brandColor: data.branding.brandColor ?? null,
          workspaceName: data.workspace?.name ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setBrand(null);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return brand;
}
