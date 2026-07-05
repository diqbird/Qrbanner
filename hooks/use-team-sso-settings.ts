'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { WorkspaceRow } from '@/lib/team-workspace-types';

type Translate = (key: string) => string;

export function useTeamSsoSettings({
  workspace,
  activeId,
  fetchMembers,
  t,
  setWorking,
}: {
  workspace: WorkspaceRow | null;
  activeId: string;
  fetchMembers: (wsId: string) => Promise<void>;
  t: Translate;
  setWorking: (v: boolean) => void;
}) {
  const [ssoProvider, setSsoProvider] = useState('google');
  const [idpEntityId, setIdpEntityId] = useState('');
  const [idpSsoUrl, setIdpSsoUrl] = useState('');
  const [idpCertificate, setIdpCertificate] = useState('');
  const [allowedDomainsText, setAllowedDomainsText] = useState('');

  useEffect(() => {
    if (!workspace || workspace.isPersonal) return;
    setSsoProvider(workspace.ssoProvider ?? 'google');
    setIdpEntityId(workspace.idpEntityId ?? '');
    setIdpSsoUrl(workspace.idpSsoUrl ?? '');
    setIdpCertificate(workspace.idpCertificate ?? '');
    const domains = Array.isArray(workspace.allowedDomains) ? workspace.allowedDomains : [];
    setAllowedDomainsText(domains.join(', '));
  }, [workspace]);

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

  return {
    ssoProvider,
    setSsoProvider,
    idpEntityId,
    setIdpEntityId,
    idpSsoUrl,
    setIdpSsoUrl,
    idpCertificate,
    setIdpCertificate,
    allowedDomainsText,
    setAllowedDomainsText,
    saveSsoSettings,
    toggleSso,
  };
}

export type TeamSsoSettingsState = ReturnType<typeof useTeamSsoSettings>;
