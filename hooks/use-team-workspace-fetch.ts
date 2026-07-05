'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MemberRow, WorkspaceRow } from '@/lib/team-workspace-types';

export function useTeamWorkspaceFetch(activeId: string) {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);
  const [role, setRole] = useState('viewer');

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

  const canManage = ['owner', 'admin'].includes(role);
  const isTeam = workspace && !workspace.isPersonal;

  return { members, workspace, role, fetchMembers, canManage, isTeam };
}
