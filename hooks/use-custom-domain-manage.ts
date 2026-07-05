'use client';

import { toast } from 'sonner';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useCustomDomainManage({ t, reload }: { t: Translate; reload: () => void }) {
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

  return { setPrimary, removeDomain, copy };
}
