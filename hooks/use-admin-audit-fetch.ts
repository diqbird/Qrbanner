'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ADMIN_AUDIT_PAGE_SIZE,
  type AuditEntry,
} from '@/lib/admin-audit-types';

export function useAdminAuditFetch(actionFilter: string) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
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

  return { entries, total, offset, loading, fetchLogs };
}
