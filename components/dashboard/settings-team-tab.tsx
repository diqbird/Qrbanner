'use client';

import { TeamWorkspaceSettings } from '@/components/dashboard/team-workspace-settings';
import { EnterpriseWorkspaceSettings } from '@/components/dashboard/enterprise-workspace-settings';

export function SettingsTeamTab() {
  return (
    <>
      <TeamWorkspaceSettings />
      <EnterpriseWorkspaceSettings />
    </>
  );
}
