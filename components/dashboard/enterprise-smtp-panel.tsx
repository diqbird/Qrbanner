'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseSmtpPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseSmtpPanel({ enterprise }: EnterpriseSmtpPanelProps) {
  const {
    t,
    state,
    working,
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
    saveSmtp,
    toggleSmtp,
    sendSmtpTest,
  } = enterprise;

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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('enterpriseWorkspace.smtpHost')}</Label>
          <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.example.com" />
        </div>
        <div className="space-y-2">
          <Label>{t('enterpriseWorkspace.smtpPort')}</Label>
          <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" />
        </div>
        <div className="space-y-2">
          <Label>{t('enterpriseWorkspace.smtpUser')}</Label>
          <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="no-reply@company.com" />
        </div>
        <div className="space-y-2">
          <Label>{t('enterpriseWorkspace.smtpPassword')}</Label>
          <Input
            type="password"
            value={smtpPassword}
            onChange={(e) => setSmtpPassword(e.target.value)}
            placeholder={state.smtpConfigured ? '••••••••' : ''}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>{t('enterpriseWorkspace.smtpFrom')}</Label>
          <Input value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} placeholder="notifications@company.com" />
        </div>
      </div>
      <Button type="button" variant="outline" loading={working} onClick={saveSmtp}>
        {t('enterpriseWorkspace.saveSmtp')}
      </Button>
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
    </div>
  );
}
