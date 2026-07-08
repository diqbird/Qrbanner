'use client';

import { useQuery } from '@tanstack/react-query';
import { Mail, Bell, Workflow } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState, AdminEmptyState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type NotificationsData = {
  smtpConfigured: boolean;
  scanNotifyQrs: number;
  automationFlows: number;
  automationLogs7d: number;
  recentLogs: {
    id: string;
    trigger: string;
    success: boolean;
    error: string | null;
    createdAt: string;
    flowName: string;
    ownerEmail: string;
  }[];
};

export function AdminNotificationsPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.notifications(),
    queryFn: async () => {
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) throw new Error('notifications');
      return res.json() as Promise<NotificationsData>;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('superAdmin.nav.notifications')} description={t('superAdmin.notifications.desc')} />
        <AdminLoadingState />
      </div>
    );
  }

  const cards = [
    { icon: Mail, label: t('superAdmin.notifications.smtp'), value: data.smtpConfigured ? t('superAdmin.notifications.configured') : t('superAdmin.notifications.notConfigured'), ok: data.smtpConfigured },
    { icon: Bell, label: t('superAdmin.notifications.scanNotifyQrs'), value: formatLocaleNumber(data.scanNotifyQrs, locale), ok: true },
    { icon: Workflow, label: t('superAdmin.notifications.automationFlows'), value: formatLocaleNumber(data.automationFlows, locale), ok: true },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.notifications')} description={t('superAdmin.notifications.desc')} />
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <c.icon className="h-4 w-4" /> {c.label}
              </div>
              <p className={`mt-1 font-display text-2xl font-bold ${c.ok ? '' : 'text-destructive'}`}>{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('superAdmin.notifications.recentLogs', { count: formatLocaleNumber(data.automationLogs7d, locale) })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentLogs.length === 0 ? (
            <AdminEmptyState title={t('superAdmin.notifications.empty')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('superAdmin.col.name')}</TableHead>
                  <TableHead>{t('superAdmin.col.owner')}</TableHead>
                  <TableHead>{t('superAdmin.notifications.trigger')}</TableHead>
                  <TableHead>{t('superAdmin.col.status')}</TableHead>
                  <TableHead>{t('superAdmin.col.created')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentLogs.map((log: NotificationsData['recentLogs'][number]) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.flowName}</TableCell>
                    <TableCell className="text-sm">{log.ownerEmail}</TableCell>
                    <TableCell className="text-sm">{log.trigger}</TableCell>
                    <TableCell>
                      <Badge variant={log.success ? 'default' : 'destructive'}>
                        {log.success ? t('superAdmin.notifications.success') : t('superAdmin.notifications.failed')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatLocaleDateTime(log.createdAt, locale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
