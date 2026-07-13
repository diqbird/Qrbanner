'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { API_BASE, parseApiKeyStatus } from '@/lib/api-key-types';

export function useApiKeySettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/auth/api-key',
    parse: parseApiKeyStatus,
  });
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [working, setWorking] = useState(false);
  const [allowlistDraft, setAllowlistDraft] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const hasKey = data?.hasKey ?? false;
  const prefix = data?.prefix ?? null;
  const createdAt = data?.createdAt ?? null;
  const planId = data?.planId ?? null;
  const planName = data?.planName ?? null;
  const usage = data?.usage ?? null;
  const mfaEnabled = data?.mfaEnabled ?? false;

  useEffect(() => {
    if (data) {
      setAllowlistDraft((data.ipAllowlist ?? []).join('\n'));
    }
  }, [data]);

  const mfaPayload = () => (mfaEnabled ? { mfaCode: mfaCode.trim() } : {});

  const generateKey = async () => {
    if (hasKey && !confirm(t('settings.apiKey.confirmRegenerate'))) return;
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.apiKey.mfaRequired'));
      return;
    }
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mfaPayload()),
      });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.apiKey.generateFailed'));
      setNewKey(json.api_key);
      setShowKeyDialog(true);
      setMfaCode('');
      reload();
      toast.success(t('settings.apiKey.generated'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const revokeKey = async () => {
    if (!confirm(t('settings.apiKey.confirmRevoke'))) return;
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.apiKey.mfaRequired'));
      return;
    }
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mfaPayload()),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return toast.error(resolveApiError(t, json.error, 'settings.apiKey.revokeFailed'));
      }
      toast.success(t('settings.apiKey.revoked'));
      setMfaCode('');
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const saveAllowlist = async () => {
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.apiKey.mfaRequired'));
      return;
    }
    setWorking(true);
    try {
      const entries = allowlistDraft
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch('/api/auth/api-key', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_allowlist: entries, ...mfaPayload() }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.apiKey.allowlistSaveFailed'));
        return;
      }
      toast.success(t('settings.apiKey.allowlistSaved'));
      setMfaCode('');
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard?.writeText(newKey);
      toast.success(t('settings.apiKey.copied'));
    }
  };

  const copyCurl = () => {
    const curl = t('settings.apiKey.curlExample', { baseUrl: API_BASE });
    navigator.clipboard?.writeText(curl);
    toast.success(t('settings.apiKey.curlCopied'));
  };

  return {
    t,
    loading,
    hasKey,
    prefix,
    createdAt,
    planId,
    planName,
    usage,
    mfaEnabled,
    mfaCode,
    setMfaCode,
    working,
    newKey,
    showKeyDialog,
    setShowKeyDialog,
    allowlistDraft,
    setAllowlistDraft,
    generateKey,
    revokeKey,
    saveAllowlist,
    copyKey,
    copyCurl,
  };
}

export type ApiKeySettingsState = ReturnType<typeof useApiKeySettings>;
