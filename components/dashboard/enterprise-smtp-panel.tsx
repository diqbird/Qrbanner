'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Mail } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';
import { EnterpriseSmtpFormFields } from './enterprise-smtp-form-fields';
import { EnterpriseSmtpTestBar } from './enterprise-smtp-test-bar';

type EnterpriseSmtpPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseSmtpPanel({ enterprise }: EnterpriseSmtpPanelProps) {
  const { t, state, working, saveSmtp, toggleSmtp } = enterprise;

  if (!state) return null;
  const { workspace } = state;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('enterpriseWorkspace.smtpTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.smtpDesc')}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('enterpriseWorkspace.enableSmtp')}</span>
        <Switch checked={workspace.smtpEnabled} onCheckedChange={toggleSmtp} />
      </div>
      <EnterpriseSmtpFormFields enterprise={enterprise} smtpConfigured={state.smtpConfigured} />
      <Button type="button" variant="outline" loading={working} onClick={saveSmtp}>
        {t('enterpriseWorkspace.saveSmtp')}
      </Button>
      <EnterpriseSmtpTestBar enterprise={enterprise} />
    </div>
  );
}
