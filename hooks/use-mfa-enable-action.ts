'use client';

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
}: {
  t: Translate;
  enableCode: string;
  setSetup: (setup: MfaSetupData | null) => void;
  setEnableCode: (code: string) => void;
  setWorking: (working: boolean) => void;
  reload: () => void;
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
      toast.success(t('settings.mfa.enabled'));
      setSetup(null);
      setEnableCode('');
      reload();
    } finally {
      setWorking(false);
    }
  };

  return { confirmEnable };
}
