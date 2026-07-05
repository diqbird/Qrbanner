'use client';

import { useTeamWorkspaceSwitchCreate } from '@/hooks/use-team-workspace-switch-create';
import { useTeamWorkspaceMemberActions } from '@/hooks/use-team-workspace-member-actions';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useTeamWorkspaceMutations({
  activeId,
  t,
  setWorking,
  reloadWorkspaces,
  fetchMembers,
}: {
  activeId: string;
  t: Translate;
  setWorking: (working: boolean) => void;
  reloadWorkspaces: () => Promise<void>;
  fetchMembers: (wsId: string) => Promise<void>;
}) {
  const { newTeamName, setNewTeamName, switchWorkspace, createTeam } = useTeamWorkspaceSwitchCreate({
    t,
    setWorking,
    reloadWorkspaces,
    fetchMembers,
  });

  const { inviteEmail, setInviteEmail, inviteMember, removeMember } = useTeamWorkspaceMemberActions({
    activeId,
    t,
    setWorking,
    fetchMembers,
  });

  return {
    inviteEmail,
    setInviteEmail,
    newTeamName,
    setNewTeamName,
    switchWorkspace,
    createTeam,
    inviteMember,
    removeMember,
  };
}
