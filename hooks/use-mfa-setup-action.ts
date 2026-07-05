'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { MfaSetupData } from '@/lib/mfa-types';

type Translate = (key: string) => string;

export function useMfaSetupAction({
  t,
  hasPassword,
  password,
  setSetup,
  setPassword,
  setWorking,
}: {
  t: Translate;
  hasPassword: boolean;
  password: string;
  setSetup: (setup: MfaSetupData | null) => void;
  setPassword: (password: string) => void;
  setWorking: (working: boolean) => void;
}) {
  const startSetup = async () => {
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: hasPassword ? password : undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.mfa.setupFailed'));
        return;
      }
      setSetup({
        qrDataUrl: json.qrDataUrl,
        secret: json.secret,
        otpauthUrl: json.otpauthUrl,
      });
      setPassword('');
    } finally {
      setWorking(false);
    }
  };

  return { startSetup };
}
