'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { useEnterpriseClients } from '@/hooks/use-enterprise-clients';
import { useEnterpriseSmtp } from '@/hooks/use-enterprise-smtp';
import { useEnterpriseWorkspacePatch } from '@/hooks/use-enterprise-workspace-patch';
import { useEnterpriseWorkspaceDetails } from '@/hooks/use-enterprise-workspace-details';
import { parseActiveWorkspace, type EnterpriseState } from '@/lib/enterprise-workspace-types';

export function useEnterpriseWorkspace() {
  const { t, locale } = useLanguage();
  const { data: wsData, loading: wsLoading } = useSettingsResource({
    url: '/api/workspace',
    parse: parseActiveWorkspace,
  });
  const activeId = wsData?.activeWorkspaceId ?? '';
  const [state, setState] = useState<EnterpriseState | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [working, setWorking] = useState(false);

  const clients = useEnterpriseClients(activeId, t);

  const patch = useEnterpriseWorkspacePatch({
    activeId,
    t,
    setState,
    setWorking,
    onClientsRefresh: clients.fetchClients,
  });

  const smtp = useEnterpriseSmtp({
    activeId,
    state,
    patchEnterprise: patch.patchEnterprise,
    t,
    locale,
    setWorking,
  });

  const loadEnterpriseDetails = useEnterpriseWorkspaceDetails({
    patch,
    clients,
    smtp,
    setState,
    setDetailLoading,
  });

  useEffect(() => {
    if (activeId) loadEnterpriseDetails(activeId);
  }, [activeId, loadEnterpriseDetails]);

  const loading = wsLoading || detailLoading;
  const isWorking = working || clients.clientWorking;

  return {
    t,
    loading,
    state,
    clients: clients.clients,
    clientLimit: clients.clientLimit,
    working: isWorking,
    scimToken: patch.scimToken,
    mfaEnabled: patch.mfaEnabled,
    mfaCode: patch.mfaCode,
    setMfaCode: patch.setMfaCode,
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
    toggleScim: patch.toggleScim,
    regenerateScimToken: patch.regenerateScimToken,
    toggleReseller: patch.toggleReseller,
    addClient: clients.addClient,
    removeClient: clients.removeClient,
    copyText: patch.copyText,
  };
}

export type EnterpriseWorkspaceState = ReturnType<typeof useEnterpriseWorkspace>;
