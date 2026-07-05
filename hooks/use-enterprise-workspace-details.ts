'use client';

import { useCallback } from 'react';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';

export function useEnterpriseWorkspaceDetails({
  patch,
  clients,
  smtp,
  setState,
  setDetailLoading,
}: {
  patch: { fetchEnterprise: (workspaceId: string) => Promise<EnterpriseState | null> };
  clients: { fetchClients: (workspaceId: string) => Promise<void> };
  smtp: { syncFromWorkspace: (ent: EnterpriseState) => void };
  setState: (state: EnterpriseState | null) => void;
  setDetailLoading: (loading: boolean) => void;
}) {
  return useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) return;
      setDetailLoading(true);
      try {
        const ent = await patch.fetchEnterprise(workspaceId);
        if (ent) {
          setState(ent);
          smtp.syncFromWorkspace(ent);
        }
        await clients.fetchClients(workspaceId);
      } finally {
        setDetailLoading(false);
      }
    },
    [patch.fetchEnterprise, clients.fetchClients, smtp.syncFromWorkspace, setState, setDetailLoading],
  );
}
