'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDate, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { exportRowsToCsv } from '@/lib/admin/export';
import { AdminDataToolbar } from '@/components/admin/shared/admin-data-toolbar';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

type CampaignRow = {
  id: string;
  name: string;
  ownerEmail: string;
  qrCount: number;
  totalScans: number;
  activeCount: number;
  createdAt: string;
};

export function AdminCampaignsPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading, refetch } = useQuery({
    queryKey: adminQueryKeys.campaigns(),
    queryFn: async () => {
      const res = await fetch('/api/admin/campaigns');
      if (!res.ok) throw new Error('campaigns');
      return res.json() as Promise<{
        campaigns: CampaignRow[];
        total: number;
        totalQrCodes: number;
        totalScans: number;
      }>;
    },
  });
  const campaigns = data?.campaigns ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.campaigns')} description={t('superAdmin.campaigns.desc')} />
      {data ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('superAdmin.campaigns.total')}</p>
              <p className="font-display text-2xl font-bold">{formatLocaleNumber(data.total, locale)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('superAdmin.campaigns.qrCodes')}</p>
              <p className="font-display text-2xl font-bold">{formatLocaleNumber(data.totalQrCodes, locale)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{t('superAdmin.campaigns.scans')}</p>
              <p className="font-display text-2xl font-bold">{formatLocaleNumber(data.totalScans, locale)}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
      <AdminDataToolbar
        onRefresh={() => refetch()}
        refreshLabel={t('admin.refresh')}
        onExport={() =>
          exportRowsToCsv(
            'campaigns.csv',
            ['Campaign', 'Owner', 'QR count', 'Scans', 'Active'],
            campaigns.map((c: CampaignRow) => [c.name, c.ownerEmail, c.qrCount, c.totalScans, c.activeCount]),
          )
        }
        exportLabel={t('superAdmin.exportCsv')}
      />
      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && campaigns.length === 0 ? <AdminEmptyState title={t('superAdmin.campaigns.empty')} /> : null}
      {campaigns.length > 0 ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('superAdmin.col.name')}</TableHead>
                <TableHead>{t('superAdmin.col.owner')}</TableHead>
                <TableHead>{t('superAdmin.campaigns.qrCodes')}</TableHead>
                <TableHead>{t('superAdmin.col.scans')}</TableHead>
                <TableHead>{t('superAdmin.campaigns.active')}</TableHead>
                <TableHead>{t('superAdmin.col.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c: CampaignRow) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.ownerEmail}</TableCell>
                  <TableCell>{formatLocaleNumber(c.qrCount, locale)}</TableCell>
                  <TableCell>{formatLocaleNumber(c.totalScans, locale)}</TableCell>
                  <TableCell>{formatLocaleNumber(c.activeCount, locale)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatLocaleDate(c.createdAt, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
