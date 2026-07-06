'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';

type Translate = (key: string) => string;
type PatchEnterprise = (payload: Record<string, unknown>) => Promise<Record<string, unknown> | null>;

export function useEnterpriseSmtpActions({
  activeId,
  state,
  patchEnterprise,
  t,
  locale,
  setWorking,
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPassword,
  smtpFrom,
  testEmail,
  setSmtpPassword,
}: {
  activeId: string;
  state: EnterpriseState | null;
  patchEnterprise: PatchEnterprise;
  t: Translate;
  locale: 'en' | 'tr';
  setWorking: (v: boolean) => void;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  testEmail: string;
  setSmtpPassword: (v: string) => void;
}) {
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
        body: JSON.stringify({
          action: 'test_smtp',
          workspaceId: activeId,
          testEmail: testEmail.trim(),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.smtpTestFailed'));
      toast.success(t('enterpriseWorkspace.smtpTestSent'));
    } finally {
      setWorking(false);
    }
  };

  return { saveSmtp, toggleSmtp, sendSmtpTest };
}
