'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { useEnterpriseClients } from '@/hooks/use-enterprise-clients';
import { useEnterpriseSmtp } from '@/hooks/use-enterprise-smtp';
import {
  parseActiveWorkspace,
  type EnterpriseState,
} from '@/lib/enterprise-workspace-types';

export function useEnterpriseWorkspace() {
  const { t } = useLanguage();
  const { data: wsData, loading: wsLoading } = useSettingsResource({
    url: '/api/workspace',
    parse: parseActiveWorkspace,
  });
  const activeId = wsData?.activeWorkspaceId ?? '';
  const [state, setState] = useState<EnterpriseState | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [scimToken, setScimToken] = useState<string | null>(null);

  const clients = useEnterpriseClients(activeId, t);

  const fetchEnterprise = useCallback(async (workspaceId: string) => {
    const res = await fetch(`/api/workspace/enterprise?workspaceId=${workspaceId}`);
    if (!res.ok) return null;
    return (await res.json()) as EnterpriseState;
  }, []);

  const patchEnterprise = async (payload: Record<string, unknown>) => {
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/enterprise', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: activeId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.saveFailed'));
        return null;
      }
      if (data.scimToken) setScimToken(data.scimToken);
      if (data.workspace) {
        setState((prev) =>
          prev ? { ...prev, workspace: { ...prev.workspace, ...data.workspace } } : prev,
        );
      }
      return data;
    } finally {
      setWorking(false);
    }
  };

  const smtp = useEnterpriseSmtp({ activeId, state, patchEnterprise, t, setWorking });

  const loadEnterpriseDetails = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) return;
      setDetailLoading(true);
      try {
        const ent = await fetchEnterprise(workspaceId);
        if (ent) {
          setState(ent);
          smtp.syncFromWorkspace(ent);
        }
        await clients.fetchClients(workspaceId);
      } finally {
        setDetailLoading(false);
      }
    },
    [fetchEnterprise, clients.fetchClients, smtp.syncFromWorkspace],
  );

  useEffect(() => {
    if (activeId) loadEnterpriseDetails(activeId);
  }, [activeId, loadEnterpriseDetails]);

  const loading = wsLoading || detailLoading;
  const isWorking = working || clients.clientWorking;

  const toggleScim = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_scim', scimEnabled: enabled });
    if (data) {
      toast.success(
        enabled ? t('enterpriseWorkspace.scimEnabled') : t('enterpriseWorkspace.scimDisabled'),
      );
    }
  };

  const regenerateScimToken = async () => {
    if (!confirm(t('enterpriseWorkspace.confirmRegenerateScim'))) return;
    const data = await patchEnterprise({ action: 'update_scim', scimEnabled: true, regenerateToken: true });
    if (data) toast.success(t('enterpriseWorkspace.scimTokenRegenerated'));
  };

  const toggleReseller = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_reseller', resellerEnabled: enabled });
    if (data) {
      toast.success(
        enabled ? t('enterpriseWorkspace.resellerEnabled') : t('enterpriseWorkspace.resellerDisabled'),
      );
      clients.fetchClients(activeId);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(t('enterpriseWorkspace.copied').replace('{{label}}', label));
  };

  return {
    t,
    loading,
    state,
    clients: clients.clients,
    clientLimit: clients.clientLimit,
    working: isWorking,
    scimToken,
    smtpHost: smtp.smtpHost,
    setSmtpHost: smtp.setSmtpHost,
    smtpPort: smtp.smtpPort,
    setSmtpPort: smtp.setSmtpPort,
    smtpUser: smtp.smtpUser,
    setSmtpUser: smtp.setSmtpUser,
    smtpPassword: smtp.smtpPassword,
    setSmtpPassword: smtp.setSmtpPassword,
    smtpFrom: smtp.smtpFrom,
    setSmtpFrom: smtp.setSmtpFrom,
    testEmail: smtp.testEmail,
    setTestEmail: smtp.setTestEmail,
    clientName: clients.clientName,
    setClientName: clients.setClientName,
    clientEmail: clients.clientEmail,
    setClientEmail: clients.setClientEmail,
    clientPlan: clients.clientPlan,
    setClientPlan: clients.setClientPlan,
    clientFee: clients.clientFee,
    setClientFee: clients.setClientFee,
    saveSmtp: smtp.saveSmtp,
    toggleSmtp: smtp.toggleSmtp,
    sendSmtpTest: smtp.sendSmtpTest,
    toggleScim,
    regenerateScimToken,
    toggleReseller,
    addClient: clients.addClient,
    removeClient: clients.removeClient,
    copyText,
  };
}

export type EnterpriseWorkspaceState = ReturnType<typeof useEnterpriseWorkspace>;
