export interface EnterpriseState {
  workspace: {
    id: string;
    name: string;
    slug: string;
    isPersonal: boolean;
    smtpEnabled: boolean;
    smtpHost: string | null;
    smtpPort: number | null;
    smtpUser: string | null;
    smtpFrom: string | null;
    scimEnabled: boolean;
    scimTokenPrefix: string | null;
    resellerEnabled: boolean;
    supportTier: string;
    assignedCsmName: string | null;
    assignedCsmEmail: string | null;
    slaUptimePercent: number | null;
    slaNotes: string | null;
  };
  features: { enterprise: boolean; reseller: boolean };
  scimBaseUrl: string;
  smtpConfigured: boolean;
}

export interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  plan: string;
  monthlyFeeCents: number;
  status: string;
  notes: string | null;
}

export type WorkspaceListData = {
  activeWorkspaceId: string;
};

export function parseActiveWorkspace(json: unknown): WorkspaceListData {
  const data = json as Record<string, unknown>;
  const workspaces = (data.workspaces as { id: string }[]) ?? [];
  return {
    activeWorkspaceId: String(data.activeWorkspaceId ?? workspaces[0]?.id ?? ''),
  };
}
