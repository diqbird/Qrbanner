'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { formatLocaleCurrency, formatLocaleDateTime } from '@/lib/i18n/format-locale';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AdminPaymentsPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.payments(),
    queryFn: async () => {
      const res = await fetch('/api/admin/payments');
      if (!res.ok) throw new Error('payments');
      return res.json();
    },
  });

  if (isLoading) return <AdminLoadingState />;

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.payments')} description={t('superAdmin.payments.desc')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t('admin.estimatedMrr')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatLocaleCurrency(data?.estimatedMrr ?? 0, locale, { maximumFractionDigits: 2 })}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t('admin.paddleSubscribers')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{data?.paddleSubscribers ?? 0}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{t('superAdmin.payments.webhooks')}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('superAdmin.col.provider')}</TableHead>
                <TableHead>{t('admin.audit.colTime')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.webhookEvents ?? []).map((e: { id: string; provider: string; eventId: string; createdAt: string }) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.eventId}</TableCell>
                  <TableCell>{e.provider}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatLocaleDateTime(e.createdAt, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
