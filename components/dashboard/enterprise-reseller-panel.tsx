'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Users } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseResellerPanelProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseResellerPanel({ enterprise }: EnterpriseResellerPanelProps) {
  const {
    t,
    state,
    clients,
    clientLimit,
    working,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPlan,
    setClientPlan,
    clientFee,
    setClientFee,
    toggleReseller,
    addClient,
    removeClient,
  } = enterprise;

  if (!state) return null;
  const { workspace } = state;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium">{t('enterpriseWorkspace.resellerTitle')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.resellerDesc')}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('enterpriseWorkspace.enableReseller')}</span>
        <Switch checked={workspace.resellerEnabled} onCheckedChange={toggleReseller} />
      </div>
      {workspace.resellerEnabled && (
        <>
          <p className="text-xs text-muted-foreground">
            {t('enterpriseWorkspace.clientCount')
              .replace('{{count}}', String(clients.length))
              .replace('{{limit}}', String(clientLimit))}
          </p>
          <form onSubmit={addClient} className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder={t('enterpriseWorkspace.clientName')}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <Input
              type="email"
              placeholder={t('enterpriseWorkspace.clientEmail')}
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
            <Select value={clientPlan} onValueChange={setClientPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={t('enterpriseWorkspace.clientFee')}
              value={clientFee}
              onChange={(e) => setClientFee(e.target.value)}
            />
            <Button type="submit" className="gap-1 sm:col-span-2" loading={working}>
              <Plus className="h-4 w-4" /> {t('enterpriseWorkspace.addClient')}
            </Button>
          </form>
          {clients.length > 0 && (
            <div className="space-y-2">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{c.plan}</Badge>
                    <Badge variant="outline">${(c.monthlyFeeCents / 100).toFixed(2)}/mo</Badge>
                    <Badge variant={c.status === 'active' ? 'default' : 'outline'}>{c.status}</Badge>
                    <Button variant="ghost" size="icon-sm" onClick={() => removeClient(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
