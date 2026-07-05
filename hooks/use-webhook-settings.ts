'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseWebhooks, type DeliveryRow } from '@/lib/webhook-types';

export function useWebhookSettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/webhooks',
    parse: parseWebhooks,
  });
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [working, setWorking] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [showSecretDialog, setShowSecretDialog] = useState(false);

  const webhooks = data?.webhooks ?? [];
  const limit = data?.limit ?? 2;

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks/deliveries?limit=20');
      if (res.ok) {
        const json = await res.json();
        setDeliveries(json.deliveries ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const addWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return toast.error(t('settings.webhooks.urlRequired'));
    setWorking(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), label: label.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.webhooks.addFailed'));
      setNewSecret(json.secret);
      setShowSecretDialog(true);
      setUrl('');
      setLabel('');
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

  const copySecret = () => {
    if (newSecret) {
      navigator.clipboard?.writeText(newSecret);
      toast.success(t('settings.webhooks.secretCopied'));
    }
  };

  return {
    t,
    loading,
    webhooks,
    limit,
    deliveries,
    url,
    setUrl,
    label,
    setLabel,
    working,
    newSecret,
    showSecretDialog,
    setShowSecretDialog,
    addWebhook,
    toggleEnabled,
    removeWebhook,
    copySecret,
  };
}

export type WebhookSettingsState = ReturnType<typeof useWebhookSettings>;
