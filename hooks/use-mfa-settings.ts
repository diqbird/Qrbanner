'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseMfaStatus, type MfaSetupData } from '@/lib/mfa-types';

export function useMfaSettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/auth/mfa',
    parse: parseMfaStatus,
  });
  const [working, setWorking] = useState(false);
  const [setup, setSetup] = useState<MfaSetupData | null>(null);
  const [password, setPassword] = useState('');
  const [enableCode, setEnableCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  const enabled = data?.enabled ?? false;
  const hasPassword = data?.hasPassword ?? false;

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

  return {
    t,
    loading,
    enabled,
    hasPassword,
    working,
    setup,
    setSetup,
    password,
    setPassword,
    enableCode,
    setEnableCode,
    disableCode,
    setDisableCode,
    disablePassword,
    setDisablePassword,
    startSetup,
    confirmEnable,
    disableMfa,
    copySecret,
  };
}

export type MfaSettingsState = ReturnType<typeof useMfaSettings>;
