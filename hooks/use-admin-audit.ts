'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useAdminAuditFetch } from '@/hooks/use-admin-audit-fetch';
import {
  adminAuditActionLabel,
  adminAuditFilterLabel,
  exportAdminAuditCsv,
} from '@/lib/admin-audit-export';

export function useAdminAudit() {
  const { t } = useLanguage();
  const [actionFilter, setActionFilter] = useState<string>('all');
  const { entries, total, offset, loading, fetchLogs } = useAdminAuditFetch(actionFilter);

  const hasMore = entries.length < total;

  const exportCsv = () => exportAdminAuditCsv(entries, t);

  return {
    t,
    entries,
    total,
    offset,
    actionFilter,
    setActionFilter,
    loading,
    fetchLogs,
    actionLabel: (action: string) => adminAuditActionLabel(t, action),
    filterLabel: (action: string) => adminAuditFilterLabel(t, action),
    hasMore,
    exportCsv,
  };
}

export type AdminAuditState = ReturnType<typeof useAdminAudit>;
