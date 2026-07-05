'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { SettingsCardSkeleton } from '@/components/dashboard/settings-card-skeleton';
import { useTeamWorkspace } from '@/hooks/use-team-workspace';
import { TeamWorkspaceSwitcher } from './team-workspace-switcher';
import { TeamMembersPanel } from './team-members-panel';
import { TeamSsoPanel } from './team-sso-panel';

export function TeamWorkspaceSettings() {
  const team = useTeamWorkspace();
  const { t, loading } = team;

  if (loading) return <SettingsCardSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> {t('settings.team.title')}
        </CardTitle>
        <CardDescription>{t('settings.team.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TeamWorkspaceSwitcher team={team} />
        <TeamMembersPanel team={team} />
        <TeamSsoPanel team={team} />
      </CardContent>
    </Card>
  );
}
