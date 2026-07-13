'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string) => string;

export function useMfaRegenerateAction({
  t,
  hasPassword,
  disableCode,
  disablePassword,
  setDisableCode,
  setDisablePassword,
  setWorking,
  reload,
  setRecoveryCodes,
}: {
  t: Translate;
  hasPassword: boolean;
  disableCode: string;
  disablePassword: string;
  setDisableCode: (code: string) => void;
  setDisablePassword: (password: string) => void;
  setWorking: (working: boolean) => void;
  reload: () => void;
  setRecoveryCodes: (codes: string[] | null) => void;
}) {
  const regenerateRecoveryCodes = async () => {
    if (!disableCode.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/recovery/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: disableCode.trim(),
          password: hasPassword ? disablePassword : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.mfa.recoveryRegenerateFailed'));
        return;
      }
      const codes = Array.isArray(json.recoveryCodes)
        ? json.recoveryCodes.filter((c: unknown): c is string => typeof c === 'string')
        : [];
      toast.success(t('settings.mfa.recoveryRegenerated'));
      setDisableCode('');
      setDisablePassword('');
      if (codes.length) setRecoveryCodes(codes);
      reload();
    } finally {
      setWorking(false);
    }
  };

  return { regenerateRecoveryCodes };
}
