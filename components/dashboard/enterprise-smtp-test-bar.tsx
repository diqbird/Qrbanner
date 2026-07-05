'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseSmtpTestBarProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseSmtpTestBar({ enterprise }: EnterpriseSmtpTestBarProps) {
  const { t, working, testEmail, setTestEmail, sendSmtpTest } = enterprise;

  return (
    <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
      <Input
        type="email"
        className="max-w-xs"
        placeholder={t('enterpriseWorkspace.testEmailPlaceholder')}
        value={testEmail}
        onChange={(e) => setTestEmail(e.target.value)}
      />
      <Button type="button" variant="secondary" loading={working} onClick={sendSmtpTest}>
        {t('enterpriseWorkspace.sendTest')}
      </Button>
    </div>
  );
}
