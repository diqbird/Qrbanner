'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export type InviteRole = 'viewer' | 'editor' | 'admin';

export function useTeamWorkspaceMemberActions({
  activeId,
  t,
  setWorking,
  fetchMembers,
}: {
  activeId: string;
  t: Translate;
  setWorking: (working: boolean) => void;
  fetchMembers: (wsId: string) => Promise<void>;
}) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<InviteRole>('editor');

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
          role: inviteRole,
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

  const updateMemberRole = async (memberId: string, role: InviteRole) => {
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_role',
          workspaceId: activeId,
          memberId,
          role,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return toast.error(resolveApiError(t, payload.error, 'settings.team.roleUpdateFailed'));
      }
      toast.success(t('settings.team.roleUpdated'));
      fetchMembers(activeId);
    } finally {
      setWorking(false);
    }
  };

  return {
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    inviteMember,
    removeMember,
    updateMemberRole,
  };
}
