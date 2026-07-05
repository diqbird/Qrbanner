export interface MemberRow {
  id: string;
  email: string;
  role: string;
  status: string;
  user?: { name: string | null } | null;
}

export interface WorkspaceRow {
  id: string;
  name: string;
  isPersonal: boolean;
  slug?: string;
  ssoEnabled?: boolean;
  ssoProvider?: string;
  idpEntityId?: string;
  idpSsoUrl?: string;
  idpCertificate?: string;
  allowedDomains?: string[];
}

export type WorkspaceListData = {
  workspaces: WorkspaceRow[];
  activeWorkspaceId: string;
};

export function parseWorkspaceList(json: unknown): WorkspaceListData {
  const data = json as Record<string, unknown>;
  return {
    workspaces: (data.workspaces as WorkspaceRow[]) ?? [],
    activeWorkspaceId: String(data.activeWorkspaceId ?? ''),
  };
}
