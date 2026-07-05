'use client';

import { useState } from 'react';
import type { AutomationAction, AutomationCondition, AutomationFlowData } from '@/lib/automation-types';
import { MAX_AUTOMATION_ACTIONS, MAX_AUTOMATION_CONDITIONS } from '@/lib/automation-types';
import {
  defaultAutomationAction,
  emptyAutomationDraft,
  parseAutomationFlow,
  type AutomationFlowRow,
} from '@/lib/automation-flow-utils';

export function useAutomationDraft() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AutomationFlowData>(emptyAutomationDraft());

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
    dialogOpen,
    setDialogOpen,
    editingId,
    draft,
    setDraft,
    openCreate,
    openEdit,
    updateCondition,
    addCondition,
    removeCondition,
    updateAction,
    addAction,
    removeAction,
  };
}

export type AutomationDraftState = ReturnType<typeof useAutomationDraft>;
