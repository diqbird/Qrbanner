'use client';

import { useEnterpriseSmtpState } from '@/hooks/use-enterprise-smtp-state';
import { useEnterpriseSmtpActions } from '@/hooks/use-enterprise-smtp-actions';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';
import type { Locale } from '@/lib/i18n/types';

type Translate = (key: string) => string;
type PatchEnterprise = (payload: Record<string, unknown>) => Promise<Record<string, unknown> | null>;

export function useEnterpriseSmtp({
  activeId,
  state,
  patchEnterprise,
  t,
  locale,
  setWorking,
  mfaEnabled,
  mfaCode,
  setMfaCode,
}: {
  activeId: string;
  state: EnterpriseState | null;
  patchEnterprise: PatchEnterprise;
  t: Translate;
  locale: Locale;
  setWorking: (v: boolean) => void;
  mfaEnabled: boolean;
  mfaCode: string;
  setMfaCode: (v: string) => void;
}) {
  const smtpState = useEnterpriseSmtpState();

  const actions = useEnterpriseSmtpActions({
    activeId,
    state,
    patchEnterprise,
    t,
    locale,
    setWorking,
    smtpHost: smtpState.smtpHost,
    smtpPort: smtpState.smtpPort,
    smtpUser: smtpState.smtpUser,
    smtpPassword: smtpState.smtpPassword,
    smtpFrom: smtpState.smtpFrom,
    testEmail: smtpState.testEmail,
    setSmtpPassword: smtpState.setSmtpPassword,
    mfaEnabled,
    mfaCode,
    setMfaCode,
  });

  return {
    ...smtpState,
    saveSmtp: actions.saveSmtp,
    toggleSmtp: actions.toggleSmtp,
    sendSmtpTest: actions.sendSmtpTest,
  };
}

export type EnterpriseSmtpState = ReturnType<typeof useEnterpriseSmtp>;
