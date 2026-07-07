'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { exportRowsToCsv } from '@/lib/admin/export';
import { AdminDataToolbar } from '@/components/admin/shared/admin-data-toolbar';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminQrPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: adminQueryKeys.qr({ q: search }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/qr?${params}`);
      if (!res.ok) throw new Error('qr');
      return res.json();
    },
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.qr')} description={t('superAdmin.qr.desc')} />
      <AdminDataToolbar search={search} onSearchChange={setSearch} searchPlaceholder={t('superAdmin.searchQr')} onRefresh={() => refetch()} refreshLabel={t('admin.refresh')} onExport={() => exportRowsToCsv('qr-codes.csv', ['Name', 'Code', 'Owner', 'Scans', 'Active'], items.map((q: { name: string; shortCode: string; ownerEmail: string; scanCount: number; isActive: boolean }) => [q.name, q.shortCode, q.ownerEmail, q.scanCount, q.isActive ? 'yes' : 'no']))} exportLabel={t('superAdmin.exportCsv')} />
      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && items.length === 0 ? <AdminEmptyState title={t('superAdmin.empty.qr')} /> : null}
      {items.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader><TableRow><TableHead>{t('superAdmin.col.name')}</TableHead><TableHead>{t('superAdmin.col.code')}</TableHead><TableHead>{t('superAdmin.col.owner')}</TableHead><TableHead>{t('superAdmin.col.scans')}</TableHead><TableHead>{t('superAdmin.col.status')}</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((q: { id: string; name: string; shortCode: string; ownerEmail: string; scanCount: number; isActive: boolean }) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.name}</TableCell>
                  <TableCell className="font-mono text-xs">{q.shortCode}</TableCell>
                  <TableCell className="text-sm">{q.ownerEmail}</TableCell>
                  <TableCell>{q.scanCount}</TableCell>
                  <TableCell><Badge variant={q.isActive ? 'default' : 'secondary'}>{q.isActive ? t('superAdmin.active') : t('superAdmin.inactive')}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
