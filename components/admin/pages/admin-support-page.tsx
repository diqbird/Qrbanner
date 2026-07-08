'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminDataToolbar } from '@/components/admin/shared/admin-data-toolbar';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Inquiry = {
  id: string;
  type: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  open: 'default',
  in_progress: 'outline',
  closed: 'secondary',
};

export function AdminSupportPage() {
  const { t, locale } = useLanguage();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: adminQueryKeys.support({ status: statusFilter }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/support?${params}`);
      if (!res.ok) throw new Error('support');
      return res.json() as Promise<{ items: Inquiry[]; openCount: number; total: number }>;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('patch');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, 'support'] });
      toast.success(t('superAdmin.support.statusUpdated'));
    },
    onError: () => toast.error(t('superAdmin.support.statusFailed')),
  });

  const items = data?.items ?? [];

  const statusLabel = (status: string) =>
    status === 'open'
      ? t('superAdmin.support.open')
      : status === 'in_progress'
        ? t('superAdmin.support.inProgress')
        : t('superAdmin.support.closed');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.support')}
        description={t('superAdmin.support.desc')}
        actions={
          data ? (
            <Badge variant="secondary">
              {t('superAdmin.support.openCount', { count: formatLocaleNumber(data.openCount, locale) })}
            </Badge>
          ) : null
        }
      />
      <AdminDataToolbar
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'all', label: t('superAdmin.support.filterAll') },
          { value: 'open', label: t('superAdmin.support.open') },
          { value: 'in_progress', label: t('superAdmin.support.inProgress') },
          { value: 'closed', label: t('superAdmin.support.closed') },
        ]}
        onRefresh={() => refetch()}
        refreshLabel={t('admin.refresh')}
      />
      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && items.length === 0 ? (
        <AdminEmptyState title={t('superAdmin.support.empty')} description={t('superAdmin.support.emptyHint')} />
      ) : null}
      <div className="space-y-4">
        {items.map((inq: Inquiry) => (
          <Card key={inq.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{inq.name}</p>
                    <span className="text-sm text-muted-foreground">{inq.email}</span>
                    <Badge variant="outline" className="text-xs">{inq.type}</Badge>
                    <Badge variant={STATUS_VARIANTS[inq.status] ?? 'secondary'}>{statusLabel(inq.status)}</Badge>
                  </div>
                  {inq.company ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{inq.company}{inq.phone ? ` · ${inq.phone}` : ''}</p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{inq.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatLocaleDateTime(inq.createdAt, locale)}</p>
                </div>
                <Select
                  value={inq.status}
                  onValueChange={(status) => statusMutation.mutate({ id: inq.id, status })}
                >
                  <SelectTrigger className="w-[160px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">{t('superAdmin.support.open')}</SelectItem>
                    <SelectItem value="in_progress">{t('superAdmin.support.inProgress')}</SelectItem>
                    <SelectItem value="closed">{t('superAdmin.support.closed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
