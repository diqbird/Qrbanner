'use client';

import { useQuery } from '@tanstack/react-query';
import { Database, HardDrive, Clock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState, AdminEmptyState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type BackupData = {
  tables: { users: number; qrCodes: number; scans: number; workspaces: number; leads: number };
  backupDir: string;
  backupsAvailable: boolean;
  backups: { name: string; sizeBytes: number; createdAt: string }[];
  schedule: string;
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function AdminBackupPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.backup(),
    queryFn: async () => {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) throw new Error('backup');
      return res.json() as Promise<BackupData>;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('superAdmin.nav.backup')} description={t('superAdmin.backup.desc')} />
        <AdminLoadingState />
      </div>
    );
  }

  const tableCards = [
    { label: t('superAdmin.backup.users'), value: data.tables.users },
    { label: t('superAdmin.backup.qrCodes'), value: data.tables.qrCodes },
    { label: t('superAdmin.backup.scans'), value: data.tables.scans },
    { label: t('superAdmin.backup.workspaces'), value: data.tables.workspaces },
    { label: t('superAdmin.backup.leads'), value: data.tables.leads },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.backup')}
        description={t('superAdmin.backup.desc')}
        actions={
          <Badge variant={data.backupsAvailable ? 'default' : 'destructive'}>
            {data.backupsAvailable ? t('superAdmin.backup.cronActive') : t('superAdmin.backup.cronMissing')}
          </Badge>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" /> {t('superAdmin.backup.scheduleTitle')}
          </CardTitle>
          <CardDescription>{t('superAdmin.backup.scheduleDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm">{data.schedule}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.backupDir}</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tableCards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" /> {c.label}
              </div>
              <p className="mt-1 font-display text-2xl font-bold">{formatLocaleNumber(c.value, locale)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HardDrive className="h-5 w-5 text-primary" /> {t('superAdmin.backup.filesTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.backups.length === 0 ? (
            <AdminEmptyState title={t('superAdmin.backup.filesEmpty')} description={t('superAdmin.backup.filesEmptyHint')} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('superAdmin.col.name')}</TableHead>
                  <TableHead>{t('superAdmin.backup.size')}</TableHead>
                  <TableHead>{t('superAdmin.col.created')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.backups.map((b: BackupData['backups'][number]) => (
                  <TableRow key={b.name}>
                    <TableCell className="font-mono text-xs">{b.name}</TableCell>
                    <TableCell>{formatSize(b.sizeBytes)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatLocaleDateTime(b.createdAt, locale)}</TableCell>
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
