'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { ClientRow } from '@/lib/enterprise-workspace-types';

type Translate = (key: string) => string;

export function useEnterpriseClients(activeId: string, t: Translate) {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientLimit, setClientLimit] = useState(0);
  const [working, setWorking] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPlan, setClientPlan] = useState('free');
  const [clientFee, setClientFee] = useState('0');

  const fetchClients = useCallback(async (workspaceId: string) => {
    const res = await fetch(`/api/workspace/clients?workspaceId=${workspaceId}`);
    if (!res.ok) return;
    const data = await res.json();
    setClients(data.clients ?? []);
    setClientLimit(data.limit ?? 0);
  }, []);

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    setWorking(true);
    try {
      const res = await fetch('/api/workspace/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: activeId,
          name: clientName.trim(),
          email: clientEmail.trim() || null,
          plan: clientPlan,
          monthlyFeeUsd: clientFee,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'enterpriseWorkspace.clientCreateFailed'));
      toast.success(t('enterpriseWorkspace.clientCreated'));
      setClientName('');
      setClientEmail('');
      setClientFee('0');
      fetchClients(activeId);
    } finally {
      setWorking(false);
    }
  };

  const removeClient = async (id: string) => {
    if (!confirm(t('enterpriseWorkspace.confirmDeleteClient'))) return;
    const res = await fetch(`/api/workspace/clients/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('enterpriseWorkspace.clientDeleted'));
      fetchClients(activeId);
    }
  };

  return {
    clients,
    clientLimit,
    clientWorking: working,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPlan,
    setClientPlan,
    clientFee,
    setClientFee,
    fetchClients,
    addClient,
    removeClient,
  };
}

export type EnterpriseClientsState = ReturnType<typeof useEnterpriseClients>;
