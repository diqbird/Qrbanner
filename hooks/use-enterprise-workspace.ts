'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import {
  parseActiveWorkspace,
  type ClientRow,
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
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientLimit, setClientLimit] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [scimToken, setScimToken] = useState<string | null>(null);

  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPlan, setClientPlan] = useState('free');
  const [clientFee, setClientFee] = useState('0');

  const fetchEnterprise = useCallback(async (workspaceId: string) => {
    const res = await fetch(`/api/workspace/enterprise?workspaceId=${workspaceId}`);
    if (!res.ok) return null;
    return (await res.json()) as EnterpriseState;
  }, []);

  const fetchClients = useCallback(async (workspaceId: string) => {
    const res = await fetch(`/api/workspace/clients?workspaceId=${workspaceId}`);
    if (!res.ok) return;
    const data = await res.json();
    setClients(data.clients ?? []);
    setClientLimit(data.limit ?? 0);
  }, []);

  const loadEnterpriseDetails = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) return;
      setDetailLoading(true);
      try {
        const ent = await fetchEnterprise(workspaceId);
        if (ent) {
          setState(ent);
          setSmtpHost(ent.workspace.smtpHost ?? '');
          setSmtpPort(String(ent.workspace.smtpPort ?? 587));
          setSmtpUser(ent.workspace.smtpUser ?? '');
          setSmtpFrom(ent.workspace.smtpFrom ?? '');
          setSmtpPassword('');
        }
        await fetchClients(workspaceId);
      } finally {
        setDetailLoading(false);
      }
    },
    [fetchEnterprise, fetchClients],
  );

  useEffect(() => {
    if (activeId) loadEnterpriseDetails(activeId);
  }, [activeId, loadEnterpriseDetails]);

  const loading = wsLoading || detailLoading;

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

  const saveSmtp = async () => {
    const data = await patchEnterprise({
      action: 'update_smtp',
      smtpEnabled: state?.workspace.smtpEnabled ?? false,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpFrom,
      smtpPassword: smtpPassword || undefined,
    });
    if (data) {
      toast.success(t('enterpriseWorkspace.smtpSaved'));
      setSmtpPassword('');
    }
  };

  const toggleSmtp = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_smtp', smtpEnabled: enabled });
    if (data) {
      toast.success(
        enabled ? t('enterpriseWorkspace.smtpEnabled') : t('enterpriseWorkspace.smtpDisabled'),
      );
    }
  };

  const sendSmtpTest = async () => {
    if (!testEmail.trim()) return toast.error(t('enterpriseWorkspace.testEmailRequired'));
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/enterprise', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_smtp', workspaceId: activeId, testEmail: testEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.smtpTestFailed'));
      toast.success(t('enterpriseWorkspace.smtpTestSent'));
    } finally {
      setWorking(false);
    }
  };

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
      fetchClients(activeId);
    }
  };

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: activeId,
          name: clientName.trim(),
          email: clientEmail.trim() || null,
          plan: clientPlan,
          monthlyFeeUsd: clientFee,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.clientCreateFailed'));
      toast.success(t('enterpriseWorkspace.clientCreated'));
      setClientName('');
      setClientEmail('');
      setClientFee('0');
      fetchClients(activeId);
    } finally {
      setWorking(false);
    }
  };

  const removeClient = async (id: string) => {
    if (!confirm(t('enterpriseWorkspace.confirmDeleteClient'))) return;
    const res = await fetch(`/api/workspace/clients/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('enterpriseWorkspace.clientDeleted'));
      fetchClients(activeId);
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
    clients,
    clientLimit,
    working,
    scimToken,
    smtpHost,
    setSmtpHost,
    smtpPort,
    setSmtpPort,
    smtpUser,
    setSmtpUser,
    smtpPassword,
    setSmtpPassword,
    smtpFrom,
    setSmtpFrom,
    testEmail,
    setTestEmail,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPlan,
    setClientPlan,
    clientFee,
    setClientFee,
    saveSmtp,
    toggleSmtp,
    sendSmtpTest,
    toggleScim,
    regenerateScimToken,
    toggleReseller,
    addClient,
    removeClient,
    copyText,
  };
}

export type EnterpriseWorkspaceState = ReturnType<typeof useEnterpriseWorkspace>;
