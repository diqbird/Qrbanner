'use client';

import { useEffect, useState } from 'react';
import type { WorkspaceRow } from '@/lib/team-workspace-types';

export function useTeamSsoState(workspace: WorkspaceRow | null) {
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
  };
}

export type TeamSsoFormState = ReturnType<typeof useTeamSsoState>;
