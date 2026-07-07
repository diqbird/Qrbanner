'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';

type TeamWorkspaceSwitcherProps = {
  team: TeamWorkspaceState;
};

export function TeamWorkspaceSwitcher({ team }: TeamWorkspaceSwitcherProps) {
  const { t, workspaces, activeId, newTeamName, setNewTeamName, working, switchWorkspace, createTeam } = team;

  return (
    <>
      <div className="space-y-2">
        <Label>{t('settings.team.activeWorkspace')}</Label>
        <Select value={activeId} onValueChange={switchWorkspace}>
          <SelectTrigger>
            <SelectValue>
              {(() => {
                const workspace = workspaces.find((w) => w.id === activeId);
                if (!workspace) return t('settings.team.selectWorkspace');
                return `${workspace.name}${workspace.isPersonal ? ` ${t('settings.team.personal')}` : ''}`;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name} {w.isPersonal ? t('settings.team.personal') : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={createTeam} className="flex flex-wrap gap-2">
        <Input
          placeholder={t('settings.team.newTeamPlaceholder')}
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" variant="outline" loading={working} className="gap-1">
          <Plus className="h-4 w-4" /> {t('settings.team.createTeam')}
        </Button>
      </form>
    </>
  );
}
