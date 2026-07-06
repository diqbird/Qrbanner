'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Trash2 } from 'lucide-react';
import { resolveEnumLabel } from '@/lib/i18n/resolve-enum-label';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';

type TeamMembersPanelProps = {
  team: TeamWorkspaceState;
};

export function TeamMembersPanel({ team }: TeamMembersPanelProps) {
  const {
    t,
    members,
    canManage,
    inviteEmail,
    setInviteEmail,
    working,
    inviteMember,
    removeMember,
  } = team;

  return (
    <>
      {canManage && (
        <form onSubmit={inviteMember} className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
          <Input
            type="email"
            placeholder={t('settings.team.invitePlaceholder')}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" loading={working} className="gap-1">
            <Mail className="h-4 w-4" /> {t('settings.team.invite')}
          </Button>
        </form>
      )}

      {members.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('settings.team.members')}</p>
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
            >
              <div>
                <p>{m.user?.name ?? m.email}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{resolveEnumLabel(t, 'settings.team.roles', m.role)}</Badge>
                <Badge variant={m.status === 'active' ? 'default' : 'outline'}>
                  {resolveEnumLabel(t, 'settings.team.statuses', m.status)}
                </Badge>
                {canManage && m.role !== 'owner' && (
                  <Button variant="ghost" size="icon-sm" onClick={() => removeMember(m.id)} aria-label={t('common.removeAria')}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
