'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { DnsInstructions } from '@/lib/custom-domain-types';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useCustomDomainAddVerify({
  t,
  reload,
  setWorking,
  setPendingDns,
}: {
  t: Translate;
  reload: () => void;
  setWorking: (v: boolean) => void;
  setPendingDns: (dns: DnsInstructions | null) => void;
}) {
  const [newDomain, setNewDomain] = useState('');

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

  return { newDomain, setNewDomain, addDomain, verifyDomain };
}
