'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { parseDomains, type DnsInstructions } from '@/lib/custom-domain-types';

export function useCustomDomains() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/domains',
    parse: parseDomains,
  });
  const [newDomain, setNewDomain] = useState('');
  const [working, setWorking] = useState(false);
  const [pendingDns, setPendingDns] = useState<DnsInstructions | null>(null);

  const domains = data?.domains ?? [];
  const scanBaseUrl = data?.scanBaseUrl ?? 'https://qrbanner.com';
  const cnameTarget = data?.cnameTarget ?? 'qrbanner.com';

  const addDomain = async () => {
    const domain = newDomain.trim();
    if (!domain) return toast.error(t('settings.customDomain.domainRequired'));
    setWorking(true);
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.customDomain.addFailed'));
      toast.success(t('settings.customDomain.added'));
      setNewDomain('');
      setPendingDns(json.dns);
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const verifyDomain = async (id: string) => {
    setWorking(true);
    try {
      const res = await fetch(`/api/domains/${id}/verify`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.customDomain.verifyFailed'));
      toast.success(t('settings.customDomain.verified'));
      setPendingDns(null);
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const setPrimary = async (id: string) => {
    try {
      const res = await fetch(`/api/domains/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_primary: true }),
      });
      if (!res.ok) return toast.error(t('settings.customDomain.primaryFailed'));
      toast.success(t('settings.customDomain.primaryUpdated'));
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const removeDomain = async (id: string, domain: string) => {
    if (!confirm(t('settings.customDomain.confirmRemove', { domain }))) return;
    try {
      const res = await fetch(`/api/domains/${id}`, { method: 'DELETE' });
      if (!res.ok) return toast.error(t('settings.customDomain.removeFailed'));
      toast.success(t('settings.customDomain.removed'));
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(t('settings.customDomain.copied'));
  };

  return {
    t,
    loading,
    domains,
    scanBaseUrl,
    cnameTarget,
    newDomain,
    setNewDomain,
    working,
    pendingDns,
    addDomain,
    verifyDomain,
    setPrimary,
    removeDomain,
    copy,
  };
}

export type CustomDomainsState = ReturnType<typeof useCustomDomains>;
