'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import type { AutomationAction, AutomationCondition, AutomationFlowData } from '@/lib/automation-types';
import { MAX_AUTOMATION_ACTIONS, MAX_AUTOMATION_CONDITIONS } from '@/lib/automation-types';
import {
  defaultAutomationAction,
  emptyAutomationDraft,
  parseAutomationFlow,
  parseAutomationsList,
  type AutomationFlowRow,
  type AutomationLogRow,
  type AutomationQrOption,
} from '@/lib/automation-flow-utils';

export function useAutomationBuilder() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/automations',
    parse: parseAutomationsList,
  });
  const [logs, setLogs] = useState<AutomationLogRow[]>([]);
  const [qrOptions, setQrOptions] = useState<AutomationQrOption[]>([]);
  const [working, setWorking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AutomationFlowData>(emptyAutomationDraft());

  const flows = data?.flows ?? [];
  const limit = data?.limit ?? 3;

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/automations/logs?limit=20');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchQrOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/qr?limit=200');
      if (res.ok) {
        const json = await res.json();
        const rows = (json.qrCodes ?? json.codes ?? []) as AutomationQrOption[];
        setQrOptions(rows.map((q) => ({ id: q.id, name: q.name, shortCode: q.shortCode })));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchQrOptions();
  }, [fetchLogs, fetchQrOptions]);

  const refreshAll = useCallback(() => {
    reload();
    fetchLogs();
  }, [reload, fetchLogs]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyAutomationDraft());
    setDialogOpen(true);
  };

  const openEdit = (flow: AutomationFlowRow) => {
    setEditingId(flow.id);
    setDraft(parseAutomationFlow(flow));
    setDialogOpen(true);
  };

  const saveFlow = async () => {
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

  const updateCondition = (index: number, next: AutomationCondition) => {
    setDraft((prev) => {
      const conditions = [...prev.conditions];
      conditions[index] = next;
      return { ...prev, conditions };
    });
  };

  const addCondition = () => {
    if (draft.conditions.length >= MAX_AUTOMATION_CONDITIONS) return;
    setDraft((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { type: 'country', op: 'eq', value: '' }],
    }));
  };

  const removeCondition = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const updateAction = (index: number, action: AutomationAction) => {
    setDraft((prev) => {
      const actions = [...prev.actions];
      actions[index] = action;
      return { ...prev, actions };
    });
  };

  const addAction = () => {
    if (draft.actions.length >= MAX_AUTOMATION_ACTIONS) return;
    setDraft((prev) => ({ ...prev, actions: [...prev.actions, defaultAutomationAction()] }));
  };

  const removeAction = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  return {
    flows,
    logs,
    qrOptions,
    limit,
    loading,
    working,
    dialogOpen,
    setDialogOpen,
    editingId,
    draft,
    setDraft,
    openCreate,
    openEdit,
    saveFlow,
    toggleEnabled,
    removeFlow,
    updateCondition,
    addCondition,
    removeCondition,
    updateAction,
    addAction,
    removeAction,
  };
}

export type AutomationBuilderState = ReturnType<typeof useAutomationBuilder>;
