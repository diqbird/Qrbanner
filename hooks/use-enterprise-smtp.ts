'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';

type Translate = (key: string) => string;

type PatchEnterprise = (payload: Record<string, unknown>) => Promise<Record<string, unknown> | null>;

export function useEnterpriseSmtp({
  activeId,
  state,
  patchEnterprise,
  t,
  setWorking,
}: {
  activeId: string;
  state: EnterpriseState | null;
  patchEnterprise: PatchEnterprise;
  t: Translate;
  setWorking: (v: boolean) => void;
}) {
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const syncFromWorkspace = useCallback((ent: EnterpriseState) => {
    setSmtpHost(ent.workspace.smtpHost ?? '');
    setSmtpPort(String(ent.workspace.smtpPort ?? 587));
    setSmtpUser(ent.workspace.smtpUser ?? '');
    setSmtpFrom(ent.workspace.smtpFrom ?? '');
    setSmtpPassword('');
  }, []);

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

  return {
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
    syncFromWorkspace,
    saveSmtp,
    toggleSmtp,
    sendSmtpTest,
  };
}

export type EnterpriseSmtpState = ReturnType<typeof useEnterpriseSmtp>;
