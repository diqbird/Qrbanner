'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { CampaignSummary } from '@/lib/campaign-panel-types';

export function useCampaignsPanel() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('campaigns.createFailed'));
        return;
      }
      toast.success(t('campaigns.created'));
      setNewName('');
      setShowForm(false);
      await load();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setCreating(false);
    }
  };

  return {
    t,
    campaigns,
    loading,
    creating,
    newName,
    setNewName,
    showForm,
    setShowForm,
    handleCreate,
  };
}

export type CampaignsPanelState = ReturnType<typeof useCampaignsPanel>;
