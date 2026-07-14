'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string) => string;

export function useWebhookMutations({
  t,
  reload,
  fetchDeliveries,
}: {
  t: Translate;
  reload: () => void;
  fetchDeliveries: () => Promise<void>;
}) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [working, setWorking] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/mfa');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMfaEnabled(Boolean(data.enabled));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mfaPayload = () => (mfaEnabled ? { mfaCode: mfaCode.trim() } : {});

  const addWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return toast.error(t('settings.webhooks.urlRequired'));
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.webhooks.mfaRequired'));
      return;
    }
    setWorking(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          label: label.trim() || null,
          ...mfaPayload(),
        }),
      });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.webhooks.addFailed'));
      setNewSecret(json.secret);
      setShowSecretDialog(true);
      setUrl('');
      setLabel('');
      setMfaCode('');
      reload();
      fetchDeliveries();
      toast.success(t('settings.webhooks.added'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const res = await fetch(`/api/webhooks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) reload();
  };

  const removeWebhook = async (id: string) => {
    if (!confirm(t('settings.webhooks.confirmDelete'))) return;
    const res = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.webhooks.removed'));
      reload();
    } else {
      toast.error(t('settings.webhooks.removeFailed'));
    }
  };

  const rotateSecret = async (id: string) => {
    if (!confirm(t('settings.webhooks.confirmRotate'))) return;
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.webhooks.mfaRequired'));
      return;
    }
    setWorking(true);
    try {
      const res = await fetch(`/api/webhooks/${id}/rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mfaPayload()),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, json.error, 'settings.webhooks.rotateFailed'));
        return;
      }
      setNewSecret(json.secret);
      setShowSecretDialog(true);
      setMfaCode('');
      toast.success(t('settings.webhooks.rotated'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const copySecret = () => {
    if (newSecret) {
      navigator.clipboard?.writeText(newSecret);
      toast.success(t('settings.webhooks.secretCopied'));
    }
  };

  const sendTestWebhook = async (id: string, event: 'scan' | 'lead' | 'cta_click' = 'scan') => {
    setWorking(true);
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? t('settings.webhooks.testFailed'));
        return;
      }
      toast.success(
        json.success ? t('settings.webhooks.testSuccess') : t('settings.webhooks.testFailed')
      );
      await fetchDeliveries();
    } catch {
      toast.error(t('settings.webhooks.testFailed'));
    } finally {
      setWorking(false);
    }
  };

  return {
    url,
    setUrl,
    label,
    setLabel,
    working,
    newSecret,
    showSecretDialog,
    setShowSecretDialog,
    mfaEnabled,
    mfaCode,
    setMfaCode,
    addWebhook,
    toggleEnabled,
    removeWebhook,
    rotateSecret,
    copySecret,
    sendTestWebhook,
  };
}
