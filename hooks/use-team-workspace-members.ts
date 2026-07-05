'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { MemberRow, WorkspaceRow } from '@/lib/team-workspace-types';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useTeamWorkspaceMembers({
  activeId,
  t,
  setWorking,
  reloadWorkspaces,
}: {
  activeId: string;
  t: Translate;
  setWorking: (working: boolean) => void;
  reloadWorkspaces: () => Promise<void>;
}) {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);
  const [role, setRole] = useState('viewer');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');

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
    members,
    workspace,
    role,
    inviteEmail,
    setInviteEmail,
    newTeamName,
    setNewTeamName,
    fetchMembers,
    canManage,
    isTeam,
    switchWorkspace,
    createTeam,
    inviteMember,
    removeMember,
  };
}
