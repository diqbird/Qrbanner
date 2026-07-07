'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { exportRowsToCsv } from '@/lib/admin/export';
import { formatLocaleDateTime } from '@/lib/i18n/format-locale';
import { AdminDataToolbar } from '@/components/admin/shared/admin-data-toolbar';
import { AdminPageHeader, AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminWorkspacesPage() {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.workspaces({ q: search }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/workspaces?${params}`);
      if (!res.ok) throw new Error('load_failed');
      return res.json();
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.workspaces')} description={t('superAdmin.workspaces.desc')} />
      <AdminDataToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('superAdmin.searchWorkspaces')}
        onRefresh={() => refetch()}
        refreshLabel={t('admin.refresh')}
        onExport={() =>
          exportRowsToCsv(
            'workspaces.csv',
            ['Name', 'Slug', 'Owner', 'Plan', 'Members', 'QRs', 'Created'],
            items.map((w: { name: string; slug: string; ownerEmail: string; ownerPlan: string; memberCount: number; qrCount: number; createdAt: string }) => [
              w.name, w.slug, w.ownerEmail, w.ownerPlan, w.memberCount, w.qrCount, w.createdAt,
            ]),
          )
        }
        exportLabel={t('superAdmin.exportCsv')}
      />
      {isLoading ? <AdminLoadingState /> : null}
      {isError ? <AdminErrorState title={t('admin.loadFailed')} onRetry={() => refetch()} /> : null}
      {!isLoading && !isError && items.length === 0 ? (
        <AdminEmptyState title={t('superAdmin.empty.workspaces')} />
      ) : null}
      {items.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('superAdmin.col.name')}</TableHead>
                <TableHead>{t('superAdmin.col.owner')}</TableHead>
                <TableHead>{t('admin.planCol')}</TableHead>
                <TableHead>{t('superAdmin.col.members')}</TableHead>
                <TableHead>{t('admin.qrsCol')}</TableHead>
                <TableHead>{t('admin.joinedCol')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((w: { id: string; name: string; slug: string; ownerEmail: string; ownerPlan: string; memberCount: number; qrCount: number; ssoEnabled: boolean; createdAt: string }) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <p className="font-medium">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.slug}</p>
                    {w.ssoEnabled ? <Badge variant="outline" className="mt-1 text-[10px]">SSO</Badge> : null}
                  </TableCell>
                  <TableCell className="text-sm">{w.ownerEmail}</TableCell>
                  <TableCell><Badge variant="secondary">{w.ownerPlan}</Badge></TableCell>
                  <TableCell>{w.memberCount}</TableCell>
                  <TableCell>{w.qrCount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatLocaleDateTime(w.createdAt, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
