'use client';

import type { WorkspaceRow } from '@/lib/team-workspace-types';
import { useTeamSsoState } from '@/hooks/use-team-sso-state';
import { useTeamSsoActions } from '@/hooks/use-team-sso-actions';

type Translate = (key: string) => string;

export function useTeamSsoSettings({
  workspace,
  activeId,
  fetchMembers,
  t,
  setWorking,
}: {
  workspace: WorkspaceRow | null;
  activeId: string;
  fetchMembers: (wsId: string) => Promise<void>;
  t: Translate;
  setWorking: (v: boolean) => void;
}) {
  const form = useTeamSsoState(workspace);
  const { saveSsoSettings, toggleSso } = useTeamSsoActions({
    workspace,
    activeId,
    fetchMembers,
    form,
    t,
    setWorking,
  });

  return {
    ...form,
    saveSsoSettings,
    toggleSso,
  };
}

export type TeamSsoSettingsState = ReturnType<typeof useTeamSsoSettings>;
