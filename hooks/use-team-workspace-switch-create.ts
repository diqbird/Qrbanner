'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useTeamWorkspaceSwitchCreate({
  t,
  setWorking,
  reloadWorkspaces,
  fetchMembers,
}: {
  t: Translate;
  setWorking: (working: boolean) => void;
  reloadWorkspaces: () => Promise<void>;
  fetchMembers: (wsId: string) => Promise<void>;
}) {
  const [newTeamName, setNewTeamName] = useState('');

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

  return { newTeamName, setNewTeamName, switchWorkspace, createTeam };
}
