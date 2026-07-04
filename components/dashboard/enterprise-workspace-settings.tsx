'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Building2, Mail, KeyRound, Users, Trash2, Plus, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { SettingsCardSkeleton } from '@/components/dashboard/settings-card-skeleton';

interface EnterpriseState {
  workspace: {
    id: string;
    name: string;
    slug: string;
    isPersonal: boolean;
    smtpEnabled: boolean;
    smtpHost: string | null;
    smtpPort: number | null;
    smtpUser: string | null;
    smtpFrom: string | null;
    scimEnabled: boolean;
    scimTokenPrefix: string | null;
    resellerEnabled: boolean;
  };
  features: { enterprise: boolean; reseller: boolean };
  scimBaseUrl: string;
  smtpConfigured: boolean;
}

interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  plan: string;
  monthlyFeeCents: number;
  status: string;
  notes: string | null;
}

export function EnterpriseWorkspaceSettings() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState('');
  const [state, setState] = useState<EnterpriseState | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientLimit, setClientLimit] = useState(0);
  const [loading, setLoading] = useState(true);
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

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const wsRes = await fetch('/api/workspace');
      if (!wsRes.ok) return;
      const wsData = await wsRes.json();
      const id = wsData.activeWorkspaceId ?? wsData.workspaces?.[0]?.id ?? '';
      setActiveId(id);
      if (!id) return;

      const ent = await fetchEnterprise(id);
      if (ent) {
        setState(ent);
        setSmtpHost(ent.workspace.smtpHost ?? '');
        setSmtpPort(String(ent.workspace.smtpPort ?? 587));
        setSmtpUser(ent.workspace.smtpUser ?? '');
        setSmtpFrom(ent.workspace.smtpFrom ?? '');
        setSmtpPassword('');
      }
      await fetchClients(id);
    } finally {
      setLoading(false);
    }
  }, [fetchEnterprise, fetchClients]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
          prev ? { ...prev, workspace: { ...prev.workspace, ...data.workspace } } : prev
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
    if (data) toast.success(enabled ? t('enterpriseWorkspace.smtpEnabled') : t('enterpriseWorkspace.smtpDisabled'));
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
    if (data) toast.success(enabled ? t('enterpriseWorkspace.scimEnabled') : t('enterpriseWorkspace.scimDisabled'));
  };

  const regenerateScimToken = async () => {
    if (!confirm(t('enterpriseWorkspace.confirmRegenerateScim'))) return;
    const data = await patchEnterprise({ action: 'update_scim', scimEnabled: true, regenerateToken: true });
    if (data) toast.success(t('enterpriseWorkspace.scimTokenRegenerated'));
  };

  const toggleReseller = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_reseller', resellerEnabled: enabled });
    if (data) {
      toast.success(enabled ? t('enterpriseWorkspace.resellerEnabled') : t('enterpriseWorkspace.resellerDisabled'));
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

  if (loading) return <SettingsCardSkeleton />;
  if (!state || state.workspace.isPersonal) return null;

  const { workspace, features, scimBaseUrl } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> {t('enterpriseWorkspace.title')}
        </CardTitle>
        <CardDescription>{t('enterpriseWorkspace.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {!features.enterprise && (
          <p className="text-sm text-muted-foreground rounded-lg border border-border/50 p-3">
            {t('enterpriseWorkspace.upgradeHint')}
          </p>
        )}

        {features.enterprise && (
          <>
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

            <div className="rounded-lg border border-border/50 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">{t('enterpriseWorkspace.scimTitle')}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t('enterpriseWorkspace.scimDesc')}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('enterpriseWorkspace.enableScim')}</span>
                <Switch checked={workspace.scimEnabled} onCheckedChange={toggleScim} />
              </div>
              <div className="rounded-md bg-muted/40 p-3 text-xs space-y-2">
                <p className="font-medium">{t('enterpriseWorkspace.scimBaseUrl')}</p>
                <code className="block break-all">{scimBaseUrl}</code>
                {workspace.scimTokenPrefix && (
                  <p className="text-muted-foreground">
                    {t('enterpriseWorkspace.scimTokenPrefix')}: {workspace.scimTokenPrefix}…
                  </p>
                )}
              </div>
              {scimToken && (
                <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs space-y-2">
                  <p className="font-medium">{t('enterpriseWorkspace.scimTokenOnce')}</p>
                  <code className="block break-all font-mono">{scimToken}</code>
                  <Button type="button" size="sm" variant="outline" className="gap-1" onClick={() => copyText(scimToken, 'SCIM token')}>
                    <Copy className="h-3 w-3" /> {t('enterpriseWorkspace.copyToken')}
                  </Button>
                </div>
              )}
              <Button type="button" variant="outline" loading={working} onClick={regenerateScimToken}>
                {t('enterpriseWorkspace.regenerateScimToken')}
              </Button>
            </div>
          </>
        )}

        {features.reseller && (
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
                  {t('enterpriseWorkspace.clientCount').replace('{{count}}', String(clients.length)).replace('{{limit}}', String(clientLimit))}
                </p>
                <form onSubmit={addClient} className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder={t('enterpriseWorkspace.clientName')} value={clientName} onChange={(e) => setClientName(e.target.value)} />
                  <Input type="email" placeholder={t('enterpriseWorkspace.clientEmail')} value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                  <Select value={clientPlan} onValueChange={setClientPlan}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder={t('enterpriseWorkspace.clientFee')} value={clientFee} onChange={(e) => setClientFee(e.target.value)} />
                  <Button type="submit" className="gap-1 sm:col-span-2" loading={working}>
                    <Plus className="h-4 w-4" /> {t('enterpriseWorkspace.addClient')}
                  </Button>
                </form>
                {clients.length > 0 && (
                  <div className="space-y-2">
                    {clients.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm">
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
        )}
      </CardContent>
    </Card>
  );
}
