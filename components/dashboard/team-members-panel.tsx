'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Trash2 } from 'lucide-react';
import { resolveEnumLabel } from '@/lib/i18n/resolve-enum-label';
import type { TeamWorkspaceState } from '@/hooks/use-team-workspace';
import type { InviteRole } from '@/hooks/use-team-workspace-member-actions';

function sanitizeMfa(value: string) {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 19);
}

type TeamMembersPanelProps = {
  team: TeamWorkspaceState;
};

const INVITE_ROLES: InviteRole[] = ['viewer', 'editor', 'admin'];

export function TeamMembersPanel({ team }: TeamMembersPanelProps) {
  const {
    t,
    members,
    canManage,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    working,
    inviteMember,
    removeMember,
    updateMemberRole,
    mfaEnabled,
    mfaCode,
    setMfaCode,
  } = team;

  return (
    <>
      {canManage && mfaEnabled && (
        <div className="max-w-xs space-y-2 border-t border-border/50 pt-4">
          <Label htmlFor="team-member-mfa">{t('settings.mfa.codeOrRecoveryLabel')}</Label>
          <Input
            id="team-member-mfa"
            autoComplete="one-time-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(sanitizeMfa(e.target.value))}
            placeholder={t('settings.mfa.codeOrRecoveryPlaceholder')}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">{t('settings.team.mfaHint')}</p>
        </div>
      )}
      {canManage && (
        <form
          onSubmit={inviteMember}
          className={`flex flex-wrap gap-2 ${mfaEnabled ? '' : 'border-t border-border/50'} pt-4`}
        >
          <Input
            type="email"
            placeholder={t('settings.team.invitePlaceholder')}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="max-w-xs"
          />
          <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as InviteRole)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVITE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {resolveEnumLabel(t, 'settings.team.roles', role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                {canManage && m.role !== 'owner' ? (
                  <Select
                    value={m.role}
                    onValueChange={(role) => updateMemberRole(m.id, role as InviteRole)}
                    disabled={working}
                  >
                    <SelectTrigger className="h-8 w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INVITE_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {resolveEnumLabel(t, 'settings.team.roles', role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary">{resolveEnumLabel(t, 'settings.team.roles', m.role)}</Badge>
                )}
                <Badge variant={m.status === 'active' ? 'default' : 'outline'}>
                  {resolveEnumLabel(t, 'settings.team.statuses', m.status)}
                </Badge>
                {canManage && m.role !== 'owner' && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeMember(m.id)}
                    aria-label={t('common.removeAria')}
                    disabled={working}
                  >
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
