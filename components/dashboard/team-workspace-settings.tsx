'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Users, Plus, Mail, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

interface MemberRow {
  id: string;
  email: string;
  role: string;
  status: string;
  user?: { name: string | null } | null;
}

export function TeamWorkspaceSettings() {
  const { t } = useLanguage();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeId, setActiveId] = useState('');
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [role, setRole] = useState('viewer');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [ssoProvider, setSsoProvider] = useState('google');
  const [allowedDomainsText, setAllowedDomainsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const fetchWorkspaces = useCallback(async () => {
    const res = await fetch('/api/workspace');
    if (res.ok) {
      const data = await res.json();
      setWorkspaces(data.workspaces ?? []);
      setActiveId(data.activeWorkspaceId ?? '');
    }
  }, []);

  const fetchMembers = useCallback(async (wsId: string) => {
    if (!wsId) return;
    const res = await fetch(`/api/workspace/members?workspaceId=${wsId}`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members ?? []);
      setWorkspace(data.workspace);
      setRole(data.role);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces().finally(() => setLoading(false));
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (activeId) fetchMembers(activeId);
  }, [activeId, fetchMembers]);

  useEffect(() => {
    if (!workspace || workspace.isPersonal) return;
    setSsoProvider(workspace.ssoProvider ?? 'google');
    const domains = Array.isArray(workspace.allowedDomains) ? workspace.allowedDomains : [];
    setAllowedDomainsText(domains.join(', '));
  }, [workspace]);

  const saveSsoSettings = async (patch?: { ssoEnabled?: boolean }) => {
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_sso',
          workspaceId: activeId,
          ssoEnabled: patch?.ssoEnabled ?? Boolean(workspace?.ssoEnabled),
          ssoProvider,
          allowedDomains: allowedDomainsText
            .split(/[,;\s]+/)
            .map((d) => d.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        if (patch?.ssoEnabled === undefined) {
          toast.success(t('settings.team.ssoSaved'));
        }
        fetchMembers(activeId);
      } else {
        const data = await res.json();
        toast.error(resolveApiError(t, data.error, 'settings.team.ssoUpdateFailed'));
      }
    } finally {
      setWorking(false);
    }
  };

  const toggleSso = async (enabled: boolean) => {
    await saveSsoSettings({ ssoEnabled: enabled });
    toast.success(enabled ? t('settings.team.ssoEnabled') : t('settings.team.ssoDisabled'));
  };

  const switchWorkspace = async (id: string) => {
    const res = await fetch('/api/workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'switch', workspaceId: id }),
    });
    if (res.ok) {
      setActiveId(id);
      toast.success(t('settings.team.switched'));
      window.location.reload();
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', name: newTeamName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.team.createFailed'));
      toast.success(t('settings.team.created'));
      setNewTeamName('');
      await fetchWorkspaces();
      setActiveId(data.activeWorkspaceId);
    } finally {
      setWorking(false);
    }
  };

  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          workspaceId: activeId,
          email: inviteEmail.trim(),
          role: 'editor',
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.team.inviteFailed'));
      navigator.clipboard?.writeText(data.inviteUrl);
      toast.success(t('settings.team.inviteCopied'));
      setInviteEmail('');
      fetchMembers(activeId);
    } finally {
      setWorking(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm(t('settings.team.confirmRemoveMember'))) return;
    const res = await fetch('/api/workspace/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove', workspaceId: activeId, memberId }),
    });
    if (res.ok) {
      toast.success(t('settings.team.memberRemoved'));
      fetchMembers(activeId);
    }
  };

  if (loading) return null;

  const canManage = ['owner', 'admin'].includes(role);
  const isTeam = workspace && !workspace.isPersonal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> {t('settings.team.title')}
        </CardTitle>
        <CardDescription>{t('settings.team.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t('settings.team.activeWorkspace')}</Label>
          <Select value={activeId} onValueChange={switchWorkspace}>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.team.selectWorkspace')} />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name} {w.isPersonal ? t('settings.team.personal') : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={createTeam} className="flex flex-wrap gap-2">
          <Input
            placeholder={t('settings.team.newTeamPlaceholder')}
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="outline" loading={working} className="gap-1">
            <Plus className="h-4 w-4" /> {t('settings.team.createTeam')}
          </Button>
        </form>

        {canManage && (
          <form onSubmit={inviteMember} className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
            <Input
              type="email"
              placeholder={t('settings.team.invitePlaceholder')}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="max-w-xs"
            />
            <Button type="submit" loading={working} className="gap-1">
              <Mail className="h-4 w-4" /> {t('settings.team.invite')}
            </Button>
          </form>
        )}

        {members.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('settings.team.members')}</p>
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm">
                <div>
                  <p>{m.user?.name ?? m.email}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{m.role}</Badge>
                  <Badge variant={m.status === 'active' ? 'default' : 'outline'}>{m.status}</Badge>
                  {canManage && m.role !== 'owner' && (
                    <Button variant="ghost" size="icon-sm" onClick={() => removeMember(m.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isTeam && role === 'owner' && (
          <div className="rounded-lg border border-border/50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{t('settings.team.ssoTitle')}</p>
            </div>
            <p className="text-xs text-muted-foreground">{t('settings.team.ssoDesc')}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('settings.team.enforceSso')}</span>
              <Switch
                checked={Boolean(workspace?.ssoEnabled)}
                onCheckedChange={toggleSso}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sso-provider">{t('settings.team.ssoProvider')}</Label>
              <Select value={ssoProvider} onValueChange={setSsoProvider}>
                <SelectTrigger id="sso-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">{t('settings.team.ssoProviderGoogle')}</SelectItem>
                  <SelectItem value="azure-ad">{t('settings.team.ssoProviderMicrosoft')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowed-domains">{t('settings.team.allowedDomains')}</Label>
              <Input
                id="allowed-domains"
                placeholder={t('settings.team.allowedDomainsPlaceholder')}
                value={allowedDomainsText}
                onChange={(e) => setAllowedDomainsText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('settings.team.allowedDomainsHint')}</p>
            </div>
            <Button type="button" variant="outline" loading={working} onClick={() => saveSsoSettings()}>
              {t('settings.team.saveSso')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
