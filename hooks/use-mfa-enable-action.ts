'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { MfaSetupData } from '@/lib/mfa-types';

type Translate = (key: string) => string;

export function useMfaEnableAction({
  t,
  enableCode,
  setSetup,
  setEnableCode,
  setWorking,
  reload,
  setRecoveryCodes,
}: {
  t: Translate;
  enableCode: string;
  setSetup: (setup: MfaSetupData | null) => void;
  setEnableCode: (code: string) => void;
  setWorking: (working: boolean) => void;
  reload: () => void;
  setRecoveryCodes: (codes: string[] | null) => void;
}) {
  const confirmEnable = async () => {
    if (!enableCode.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: enableCode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.mfa.enableFailed'));
        return;
      }
      const codes = Array.isArray(json.recoveryCodes)
        ? json.recoveryCodes.filter((c: unknown): c is string => typeof c === 'string')
        : [];
      toast.success(t('settings.mfa.enabled'));
      setSetup(null);
      setEnableCode('');
      if (codes.length) setRecoveryCodes(codes);
      reload();
    } finally {
      setWorking(false);
    }
  };

  return { confirmEnable };
}
