'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import {
  parseWorkspaceList,
  type MemberRow,
  type WorkspaceRow,
} from '@/lib/team-workspace-types';

export function useTeamWorkspace() {
  const { t } = useLanguage();
  const { data, loading, reload: reloadWorkspaces } = useSettingsResource({
    url: '/api/workspace',
    parse: parseWorkspaceList,
  });
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);
  const [role, setRole] = useState('viewer');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [ssoProvider, setSsoProvider] = useState('google');
  const [idpEntityId, setIdpEntityId] = useState('');
  const [idpSsoUrl, setIdpSsoUrl] = useState('');
  const [idpCertificate, setIdpCertificate] = useState('');
  const [allowedDomainsText, setAllowedDomainsText] = useState('');
  const [working, setWorking] = useState(false);

  const workspaces = data?.workspaces ?? [];
  const activeId = data?.activeWorkspaceId ?? '';

  const fetchMembers = useCallback(async (wsId: string) => {
    if (!wsId) return;
    const res = await fetch(`/api/workspace/members?workspaceId=${wsId}`);
    if (res.ok) {
      const json = await res.json();
      setMembers(json.members ?? []);
      setWorkspace(json.workspace);
      setRole(json.role);
    }
  }, []);

  useEffect(() => {
    if (activeId) fetchMembers(activeId);
  }, [activeId, fetchMembers]);

  useEffect(() => {
    if (!workspace || workspace.isPersonal) return;
    setSsoProvider(workspace.ssoProvider ?? 'google');
    setIdpEntityId(workspace.idpEntityId ?? '');
    setIdpSsoUrl(workspace.idpSsoUrl ?? '');
    setIdpCertificate(workspace.idpCertificate ?? '');
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
          idpEntityId,
          idpSsoUrl,
          idpCertificate,
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
        const err = await res.json();
        toast.error(resolveApiError(t, err.error, 'settings.team.ssoUpdateFailed'));
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
      const payload = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, payload.error, 'settings.team.createFailed'));
      toast.success(t('settings.team.created'));
      setNewTeamName('');
      await reloadWorkspaces();
      if (payload.activeWorkspaceId) fetchMembers(payload.activeWorkspaceId);
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
      const payload = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, payload.error, 'settings.team.inviteFailed'));
      navigator.clipboard?.writeText(payload.inviteUrl);
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

  const canManage = ['owner', 'admin'].includes(role);
  const isTeam = workspace && !workspace.isPersonal;

  return {
    t,
    loading,
    workspaces,
    activeId,
    members,
    workspace,
    role,
    inviteEmail,
    setInviteEmail,
    newTeamName,
    setNewTeamName,
    ssoProvider,
    setSsoProvider,
    idpEntityId,
    setIdpEntityId,
    idpSsoUrl,
    setIdpSsoUrl,
    idpCertificate,
    setIdpCertificate,
    allowedDomainsText,
    setAllowedDomainsText,
    working,
    canManage,
    isTeam,
    switchWorkspace,
    createTeam,
    inviteMember,
    removeMember,
    saveSsoSettings,
    toggleSso,
  };
}

export type TeamWorkspaceState = ReturnType<typeof useTeamWorkspace>;
