'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useSettingsResource } from '@/hooks/use-settings-resource';
import { useTeamSsoSettings } from '@/hooks/use-team-sso-settings';
import { useTeamWorkspaceMembers } from '@/hooks/use-team-workspace-members';
import { parseWorkspaceList } from '@/lib/team-workspace-types';

export function useTeamWorkspace() {
  const { t } = useLanguage();
  const { data, loading, reload: reloadWorkspaces } = useSettingsResource({
    url: '/api/workspace',
    parse: parseWorkspaceList,
  });
  const [working, setWorking] = useState(false);

  const workspaces = data?.workspaces ?? [];
  const activeId = data?.activeWorkspaceId ?? '';

  const membersState = useTeamWorkspaceMembers({
    activeId,
    t,
    setWorking,
    reloadWorkspaces,
  });

  const sso = useTeamSsoSettings({
    workspace: membersState.workspace,
    activeId,
    fetchMembers: membersState.fetchMembers,
    t,
    setWorking,
  });

  return {
    t,
    loading,
    workspaces,
    activeId,
    ...membersState,
    ssoProvider: sso.ssoProvider,
    setSsoProvider: sso.setSsoProvider,
    idpEntityId: sso.idpEntityId,
    setIdpEntityId: sso.setIdpEntityId,
    idpSsoUrl: sso.idpSsoUrl,
    setIdpSsoUrl: sso.setIdpSsoUrl,
    idpCertificate: sso.idpCertificate,
    setIdpCertificate: sso.setIdpCertificate,
    allowedDomainsText: sso.allowedDomainsText,
    setAllowedDomainsText: sso.setAllowedDomainsText,
    working,
    saveSsoSettings: sso.saveSsoSettings,
    toggleSso: sso.toggleSso,
  };
}

export type TeamWorkspaceState = ReturnType<typeof useTeamWorkspace>;
