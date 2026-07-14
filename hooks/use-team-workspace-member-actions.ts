'use client';

import { useEffect, useState } from 'react';
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
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/mfa');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMfaEnabled(Boolean(data.enabled));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mfaPayload = () => (mfaEnabled ? { mfaCode: mfaCode.trim() } : {});

  const requireMfa = () => {
    if (mfaEnabled && !mfaCode.trim()) {
      toast.error(t('settings.team.mfaRequired'));
      return false;
    }
    return true;
  };

  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    if (!requireMfa()) return;
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
          ...mfaPayload(),
        }),
      });
      const payload = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, payload.error, 'settings.team.inviteFailed'));
      navigator.clipboard?.writeText(payload.inviteUrl);
      toast.success(t('settings.team.inviteCopied'));
      setInviteEmail('');
      setMfaCode('');
      fetchMembers(activeId);
    } finally {
      setWorking(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm(t('settings.team.confirmRemoveMember'))) return;
    if (!requireMfa()) return;
    const res = await fetch('/api/workspace/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'remove',
        workspaceId: activeId,
        memberId,
        ...mfaPayload(),
      }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      return toast.error(resolveApiError(t, payload.error, 'settings.team.memberRemoveFailed'));
    }
    toast.success(t('settings.team.memberRemoved'));
    setMfaCode('');
    fetchMembers(activeId);
  };

  const updateMemberRole = async (memberId: string, role: InviteRole) => {
    if (!requireMfa()) return;
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
          ...mfaPayload(),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        return toast.error(resolveApiError(t, payload.error, 'settings.team.roleUpdateFailed'));
      }
      toast.success(t('settings.team.roleUpdated'));
      setMfaCode('');
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
    mfaEnabled,
    mfaCode,
    setMfaCode,
    inviteMember,
    removeMember,
    updateMemberRole,
  };
}
