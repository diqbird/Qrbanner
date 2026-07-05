'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { useAutomationAuxData } from '@/hooks/use-automation-aux-data';
import { useAutomationDraft } from '@/hooks/use-automation-draft';
import { parseAutomationsList } from '@/lib/automation-flow-utils';

export function useAutomationBuilder() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/automations',
    parse: parseAutomationsList,
  });
  const aux = useAutomationAuxData();
  const draftState = useAutomationDraft();
  const [working, setWorking] = useState(false);

  const flows = data?.flows ?? [];
  const limit = data?.limit ?? 3;

  const refreshAll = useCallback(() => {
    reload();
    aux.fetchLogs();
  }, [reload, aux.fetchLogs]);

  const saveFlow = async () => {
    const { editingId, draft, setDialogOpen } = draftState;
    if (!draft.name.trim()) return toast.error(t('settings.automations.nameRequired'));
    if (!draft.actions.length) return toast.error(t('settings.automations.actionRequired'));
    setWorking(true);
    try {
      const res = await fetch(editingId ? `/api/automations/${editingId}` : '/api/automations', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) {
        return toast.error(resolveApiError(t, json.error, 'settings.automations.saveFailed'));
      }
      toast.success(editingId ? t('settings.automations.updated') : t('settings.automations.created'));
      setDialogOpen(false);
      refreshAll();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const res = await fetch(`/api/automations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) reload();
  };

  const removeFlow = async (id: string) => {
    if (!confirm(t('settings.automations.confirmDelete'))) return;
    const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.automations.removed'));
      refreshAll();
    } else {
      toast.error(t('settings.automations.removeFailed'));
    }
  };

  return {
    flows,
    logs: aux.logs,
    qrOptions: aux.qrOptions,
    limit,
    loading,
    working,
    ...draftState,
    saveFlow,
    toggleEnabled,
    removeFlow,
  };
}

export type AutomationBuilderState = ReturnType<typeof useAutomationBuilder>;
