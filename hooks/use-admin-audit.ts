'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  ADMIN_AUDIT_PAGE_SIZE,
  escapeAuditCsv,
  type AuditEntry,
} from '@/lib/admin-audit-types';

export function useAdminAudit() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (nextOffset = 0, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(ADMIN_AUDIT_PAGE_SIZE),
        offset: String(nextOffset),
      });
      if (actionFilter !== 'all') params.set('action', actionFilter);

      const res = await fetch(`/api/admin/audit-log?${params}`);
      if (res.ok) {
        const data = await res.json();
        const rows = (data.entries ?? []) as AuditEntry[];
        setEntries(append ? (prev) => [...prev, ...rows] : rows);
        setTotal(data.total ?? 0);
        setOffset(nextOffset);
      }
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    fetchLogs(0, false);
  }, [fetchLogs]);

  const actionLabel = (action: string) => {
    const key = `admin.audit.actions.${action.replace(/\./g, '_')}`;
    const label = t(key);
    return label === key ? action : label;
  };

  const filterLabel = (action: string) => {
    if (action === 'all') return t('admin.audit.filterAll');
    return actionLabel(action);
  };

  const hasMore = entries.length < total;

  const exportCsv = () => {
    const header = [
      t('admin.audit.colTime'),
      t('admin.audit.colAction'),
      t('admin.audit.colActor'),
      t('admin.audit.colTarget'),
      t('admin.audit.colSummary'),
      'IP',
      'User-Agent',
    ];
    const rows = entries.map((entry) => [
      new Date(entry.createdAt).toISOString(),
      entry.action,
      entry.actorEmail ?? entry.actorId,
      entry.targetType && entry.targetId ? `${entry.targetType}:${entry.targetId}` : '',
      entry.summary ?? '',
      entry.ipAddress ?? '',
      entry.userAgent ?? '',
    ]);
    const csv = [header, ...rows].map((row) => row.map((c) => escapeAuditCsv(String(c))).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrbanner-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    t,
    entries,
    total,
    offset,
    actionFilter,
    setActionFilter,
    loading,
    fetchLogs,
    actionLabel,
    filterLabel,
    hasMore,
    exportCsv,
  };
}

export type AdminAuditState = ReturnType<typeof useAdminAudit>;
