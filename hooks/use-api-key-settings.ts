'use client';

import { useState } from 'react';
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

  const hasKey = data?.hasKey ?? false;
  const prefix = data?.prefix ?? null;
  const createdAt = data?.createdAt ?? null;
  const planId = data?.planId ?? null;
  const planName = data?.planName ?? null;
  const usage = data?.usage ?? null;

  const generateKey = async () => {
    if (hasKey && !confirm(t('settings.apiKey.confirmRegenerate'))) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.apiKey.generateFailed'));
      setNewKey(json.api_key);
      setShowKeyDialog(true);
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
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', { method: 'DELETE' });
      if (!res.ok) return toast.error(t('settings.apiKey.revokeFailed'));
      toast.success(t('settings.apiKey.revoked'));
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
    const curl = `curl -H "Authorization: Bearer YOUR_API_KEY" ${API_BASE}/api/v1/qr`;
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
    working,
    newKey,
    showKeyDialog,
    setShowKeyDialog,
    generateKey,
    revokeKey,
    copyKey,
    copyCurl,
  };
}

export type ApiKeySettingsState = ReturnType<typeof useApiKeySettings>;
