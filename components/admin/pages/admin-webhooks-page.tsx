'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminWebhooksPage() {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.webhooks(),
    queryFn: async () => {
      const res = await fetch('/api/admin/webhooks');
      if (!res.ok) throw new Error('webhooks');
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.webhooks')} description={t('superAdmin.webhooks.desc')} />
      {isLoading ? <AdminLoadingState /> : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>{t('superAdmin.col.owner')}</TableHead><TableHead>{t('superAdmin.col.deliveries')}</TableHead><TableHead>{t('superAdmin.col.status')}</TableHead></TableRow></TableHeader>
            <TableBody>
              {(data?.endpoints ?? []).map((e: { id: string; url: string; ownerEmail: string; deliveryCount: number; enabled: boolean }) => (
                <TableRow key={e.id}>
                  <TableCell className="max-w-xs truncate text-xs">{e.url}</TableCell>
                  <TableCell>{e.ownerEmail}</TableCell>
                  <TableCell>{e.deliveryCount}</TableCell>
                  <TableCell><Badge variant={e.enabled ? 'default' : 'secondary'}>{e.enabled ? t('superAdmin.active') : t('superAdmin.inactive')}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
