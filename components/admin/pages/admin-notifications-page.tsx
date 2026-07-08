'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Mail, Bell, Workflow, Send, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState, AdminEmptyState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type EmailDelivery = {
  id: string;
  kind: string;
  to: string;
  subject: string;
  success: boolean;
  error: string | null;
  createdAt: string;
};

type NotificationsData = {
  smtpConfigured: boolean;
  scanNotifyQrs: number;
  automationFlows: number;
  automationLogs7d: number;
  emailDeliveries7d: { total: number; sent: number; failed: number };
  recentEmailDeliveries: EmailDelivery[];
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
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: adminQueryKeys.notifications(),
    queryFn: async () => {
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) throw new Error('notifications');
      return res.json() as Promise<NotificationsData>;
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_email', locale }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'send_failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.notifications() });
      toast.success(t('superAdmin.notifications.testEmailSent'));
    },
    onError: (err: Error) => {
      if (err.message === 'smtp_not_configured') {
        toast.error(t('superAdmin.notifications.smtpRequired'));
      } else {
        toast.error(t('superAdmin.notifications.testEmailFailed'));
      }
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

  const kindLabel = (kind: string) => {
    const key = `superAdmin.notifications.deliveryKinds.${kind}`;
    const label = t(key);
    return label === key ? kind : label;
  };

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
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{t('superAdmin.notifications.testEmail')}</CardTitle>
            <CardDescription className="mt-1">{t('superAdmin.notifications.testEmailDesc')}</CardDescription>
          </div>
          <Button
            size="sm"
            className="gap-2"
            disabled={!data.smtpConfigured || testEmailMutation.isPending}
            onClick={() => testEmailMutation.mutate()}
          >
            <Send className="h-4 w-4" />
            {t('superAdmin.notifications.testEmail')}
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">
            {t('superAdmin.notifications.emailDeliveries7d', {
              sent: formatLocaleNumber(data.emailDeliveries7d.sent, locale),
              failed: formatLocaleNumber(data.emailDeliveries7d.failed, locale),
            })}
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {t('superAdmin.refresh')}
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentEmailDeliveries.length === 0 ? (
            <AdminEmptyState title={t('superAdmin.notifications.deliveriesEmpty')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('superAdmin.notifications.deliveryKind')}</TableHead>
                  <TableHead>{t('superAdmin.notifications.deliveryTo')}</TableHead>
                  <TableHead>{t('superAdmin.notifications.deliverySubject')}</TableHead>
                  <TableHead>{t('superAdmin.col.status')}</TableHead>
                  <TableHead>{t('superAdmin.col.created')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentEmailDeliveries.map((row: EmailDelivery) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-sm">{kindLabel(row.kind)}</TableCell>
                    <TableCell className="text-sm">{row.to}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm">{row.subject}</TableCell>
                    <TableCell>
                      <Badge variant={row.success ? 'default' : 'destructive'}>
                        {row.success ? t('superAdmin.notifications.success') : t('superAdmin.notifications.failed')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLocaleDateTime(row.createdAt, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
                    <TableCell className="text-sm text-muted-foreground">
                      {formatLocaleDateTime(log.createdAt, locale)}
                    </TableCell>
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
