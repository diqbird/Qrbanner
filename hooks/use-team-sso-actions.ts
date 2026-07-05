'use client';

import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { WorkspaceRow } from '@/lib/team-workspace-types';
import type { TeamSsoFormState } from '@/hooks/use-team-sso-state';

type Translate = (key: string) => string;

export function useTeamSsoActions({
  workspace,
  activeId,
  fetchMembers,
  form,
  t,
  setWorking,
}: {
  workspace: WorkspaceRow | null;
  activeId: string;
  fetchMembers: (wsId: string) => Promise<void>;
  form: TeamSsoFormState;
  t: Translate;
  setWorking: (v: boolean) => void;
}) {
  const {
    ssoProvider,
    idpEntityId,
    idpSsoUrl,
    idpCertificate,
    allowedDomainsText,
  } = form;

  const saveSsoSettings = async (patch?: { ssoEnabled?: boolean }) => {
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_sso',
          workspaceId: activeId,
          ssoEnabled: patch?.ssoEnabled ?? Boolean(workspace?.ssoEnabled),
          ssoProvider,
          idpEntityId,
          idpSsoUrl,
          idpCertificate,
          allowedDomains: allowedDomainsText
            .split(/[,;\s]+/)
            .map((d) => d.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        if (patch?.ssoEnabled === undefined) {
          toast.success(t('settings.team.ssoSaved'));
        }
        fetchMembers(activeId);
      } else {
        const err = await res.json();
        toast.error(resolveApiError(t, err.error, 'settings.team.ssoUpdateFailed'));
      }
    } finally {
      setWorking(false);
    }
  };

  const toggleSso = async (enabled: boolean) => {
    await saveSsoSettings({ ssoEnabled: enabled });
    toast.success(enabled ? t('settings.team.ssoEnabled') : t('settings.team.ssoDisabled'));
  };

  return { saveSsoSettings, toggleSso };
}
