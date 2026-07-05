'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { MfaSetupData } from '@/lib/mfa-types';

type Translate = (key: string) => string;

export function useMfaSettingsActions({
  t,
  hasPassword,
  password,
  enableCode,
  disableCode,
  disablePassword,
  setup,
  setSetup,
  setPassword,
  setEnableCode,
  setDisableCode,
  setDisablePassword,
  setWorking,
  reload,
}: {
  t: Translate;
  hasPassword: boolean;
  password: string;
  enableCode: string;
  disableCode: string;
  disablePassword: string;
  setup: MfaSetupData | null;
  setSetup: (setup: MfaSetupData | null) => void;
  setPassword: (password: string) => void;
  setEnableCode: (code: string) => void;
  setDisableCode: (code: string) => void;
  setDisablePassword: (password: string) => void;
  setWorking: (working: boolean) => void;
  reload: () => void;
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

  const disableMfa = async () => {
    if (!disableCode.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: disableCode.trim(),
          password: hasPassword ? disablePassword : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.mfa.disableFailed'));
        return;
      }
      toast.success(t('settings.mfa.disabled'));
      setDisableCode('');
      setDisablePassword('');
      reload();
    } finally {
      setWorking(false);
    }
  };

  const copySecret = async () => {
    if (!setup?.secret) return;
    await navigator.clipboard?.writeText(setup.secret);
    toast.success(t('settings.mfa.secretCopied'));
  };

  return { startSetup, confirmEnable, disableMfa, copySecret };
}
