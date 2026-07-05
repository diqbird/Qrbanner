'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type { AdminStats, AdminUser } from '@/lib/admin-content-types';

export function useAdminContent() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (planFilter !== 'all') params.set('plan', planFilter);

      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?${params}`),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users ?? []);
      }
    } catch {
      toast.error(t('admin.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [search, planFilter, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateUser = async (userId: string, patch: { plan?: string; role?: string }) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...patch }),
    });
    if (res.ok) {
      toast.success(t('admin.userUpdated'));
      fetchData();
    } else {
      const err = await res.json();
      toast.error(resolveApiError(t, err?.error, 'admin.updateFailed'));
    }
  };

  return {
    t,
    stats,
    users,
    search,
    setSearch,
    planFilter,
    setPlanFilter,
    loading,
    fetchData,
    updateUser,
  };
}

export type AdminContentState = ReturnType<typeof useAdminContent>;
