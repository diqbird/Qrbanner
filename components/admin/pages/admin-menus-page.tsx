'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDate, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { exportRowsToCsv } from '@/lib/admin/export';
import { AdminDataToolbar } from '@/components/admin/shared/admin-data-toolbar';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type MenuRow = {
  id: string;
  name: string;
  shortCode: string;
  ownerEmail: string;
  totalScans: number;
  isActive: boolean;
  landingPageEnabled: boolean;
  createdAt: string;
};

export function AdminMenusPage() {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: adminQueryKeys.menus({ q: search }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/menus?${params}`);
      if (!res.ok) throw new Error('menus');
      return res.json() as Promise<{ items: MenuRow[]; total: number; landingCount: number }>;
    },
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.menus')}
        description={t('superAdmin.menus.desc')}
        actions={
          data ? (
            <Badge variant="secondary">
              {t('superAdmin.menus.summary', {
                total: formatLocaleNumber(data.total, locale),
                landing: formatLocaleNumber(data.landingCount, locale),
              })}
            </Badge>
          ) : null
        }
      />
      <AdminDataToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('superAdmin.searchQr')}
        onRefresh={() => refetch()}
        refreshLabel={t('admin.refresh')}
        onExport={() =>
          exportRowsToCsv(
            'menus.csv',
            ['Name', 'Code', 'Owner', 'Scans', 'Active', 'Landing'],
            items.map((m: MenuRow) => [m.name, m.shortCode, m.ownerEmail, m.totalScans, m.isActive ? 'yes' : 'no', m.landingPageEnabled ? 'yes' : 'no']),
          )
        }
        exportLabel={t('superAdmin.exportCsv')}
      />
      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && items.length === 0 ? <AdminEmptyState title={t('superAdmin.menus.empty')} /> : null}
      {items.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('superAdmin.col.name')}</TableHead>
                <TableHead>{t('superAdmin.col.owner')}</TableHead>
                <TableHead>{t('superAdmin.col.scans')}</TableHead>
                <TableHead>{t('superAdmin.col.landing')}</TableHead>
                <TableHead>{t('superAdmin.col.status')}</TableHead>
                <TableHead>{t('superAdmin.col.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((m: MenuRow) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-sm">{m.ownerEmail}</TableCell>
                  <TableCell>{formatLocaleNumber(m.totalScans, locale)}</TableCell>
                  <TableCell>
                    <Badge variant={m.landingPageEnabled ? 'default' : 'outline'}>
                      {m.landingPageEnabled ? t('superAdmin.menus.landingOn') : t('superAdmin.menus.landingOff')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.isActive ? 'default' : 'secondary'}>
                      {m.isActive ? t('superAdmin.active') : t('superAdmin.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatLocaleDate(m.createdAt, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
