'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { EnterpriseState } from '@/lib/enterprise-workspace-types';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useEnterpriseWorkspacePatch({
  activeId,
  t,
  setState,
  setWorking,
  onClientsRefresh,
}: {
  activeId: string;
  t: Translate;
  setState: React.Dispatch<React.SetStateAction<EnterpriseState | null>>;
  setWorking: (working: boolean) => void;
  onClientsRefresh: (workspaceId: string) => void;
}) {
  const [scimToken, setScimToken] = useState<string | null>(null);

  const fetchEnterprise = useCallback(async (workspaceId: string) => {
    const res = await fetch(`/api/workspace/enterprise?workspaceId=${workspaceId}`);
    if (!res.ok) return null;
    return (await res.json()) as EnterpriseState;
  }, []);

  const patchEnterprise = async (payload: Record<string, unknown>) => {
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/enterprise', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: activeId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.saveFailed'));
        return null;
      }
      if (data.scimToken) setScimToken(data.scimToken);
      if (data.workspace) {
        setState((prev) =>
          prev ? { ...prev, workspace: { ...prev.workspace, ...data.workspace } } : prev,
        );
      }
      return data;
    } finally {
      setWorking(false);
    }
  };

  const toggleScim = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_scim', scimEnabled: enabled });
    if (data) {
      toast.success(
        enabled ? t('enterpriseWorkspace.scimEnabled') : t('enterpriseWorkspace.scimDisabled'),
      );
    }
  };

  const regenerateScimToken = async () => {
    if (!confirm(t('enterpriseWorkspace.confirmRegenerateScim'))) return;
    const data = await patchEnterprise({ action: 'update_scim', scimEnabled: true, regenerateToken: true });
    if (data) toast.success(t('enterpriseWorkspace.scimTokenRegenerated'));
  };

  const toggleReseller = async (enabled: boolean) => {
    const data = await patchEnterprise({ action: 'update_reseller', resellerEnabled: enabled });
    if (data) {
      toast.success(
        enabled ? t('enterpriseWorkspace.resellerEnabled') : t('enterpriseWorkspace.resellerDisabled'),
      );
      onClientsRefresh(activeId);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(t('enterpriseWorkspace.copied').replace('{{label}}', label));
  };

  return {
    scimToken,
    fetchEnterprise,
    patchEnterprise,
    toggleScim,
    regenerateScimToken,
    toggleReseller,
    copyText,
  };
}
