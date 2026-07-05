'use client';

import { useTeamWorkspaceFetch } from '@/hooks/use-team-workspace-fetch';
import { useTeamWorkspaceMutations } from '@/hooks/use-team-workspace-mutations';

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
  const { members, workspace, role, fetchMembers, canManage, isTeam } = useTeamWorkspaceFetch(activeId);
  const mutations = useTeamWorkspaceMutations({
    activeId,
    t,
    setWorking,
    reloadWorkspaces,
    fetchMembers,
  });

  return {
    members,
    workspace,
    role,
    fetchMembers,
    canManage,
    isTeam,
    ...mutations,
  };
}
