'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseSmtpFormFieldsProps = {
  enterprise: EnterpriseWorkspaceState;
  smtpConfigured: boolean;
};

export function EnterpriseSmtpFormFields({ enterprise, smtpConfigured }: EnterpriseSmtpFormFieldsProps) {
  const {
    t,
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
  } = enterprise;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>{t('enterpriseWorkspace.smtpHost')}</Label>
        <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder={t('enterpriseWorkspace.smtpHostPlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label>{t('enterpriseWorkspace.smtpPort')}</Label>
        <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder={t('enterpriseWorkspace.smtpPortPlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label>{t('enterpriseWorkspace.smtpUser')}</Label>
        <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder={t('enterpriseWorkspace.smtpUserPlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label>{t('enterpriseWorkspace.smtpPassword')}</Label>
        <Input
          type="password"
          value={smtpPassword}
          onChange={(e) => setSmtpPassword(e.target.value)}
          placeholder={smtpConfigured ? t('enterpriseWorkspace.smtpPasswordMaskedPlaceholder') : ''}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>{t('enterpriseWorkspace.smtpFrom')}</Label>
        <Input value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} placeholder={t('enterpriseWorkspace.smtpFromPlaceholder')} />
      </div>
    </div>
  );
}
