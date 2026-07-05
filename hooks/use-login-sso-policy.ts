'use client';

import { useCallback } from 'react';
import type { SsoPolicy } from '@/lib/login-form-types';

export function useLoginSsoPolicy() {
  const checkSsoPolicy = useCallback(async (value: string, setSsoPolicy: (policy: SsoPolicy | null) => void) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setSsoPolicy(null);
      return;
    }
    try {
      const res = await fetch(`/api/auth/sso-policy?email=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = (await res.json()) as SsoPolicy;
        setSsoPolicy(data);
      }
    } catch {
      setSsoPolicy(null);
    }
  }, []);

  return { checkSsoPolicy };
}
