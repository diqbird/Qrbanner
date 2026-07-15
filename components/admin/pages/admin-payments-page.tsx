'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { formatLocaleCurrency, formatLocaleDateTime, formatLocaleNumber } from '@/lib/i18n/format-locale';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type MarketplacePurchaseRow = {
  id: string;
  amountCents: number;
  platformFeeCents: number;
  sellerNetCents: number;
  currency: string;
  settledAt: string | null;
  settleNote: string | null;
  createdAt: string;
  paddleTransactionId: string | null;
  listing: {
    title: string;
    seller: { displayName: string; user: { email: string } };
  };
  buyer: { email: string };
};

export function AdminPaymentsPage() {
  const { t, locale } = useLanguage();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.payments(),
    queryFn: async () => {
      const res = await fetch('/api/admin/payments');
      if (!res.ok) throw new Error('payments');
      return res.json();
    },
  });

  const settleMutation = useMutation({
    mutationFn: async (purchaseId: string) => {
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, settle: true }),
      });
      if (!res.ok) throw new Error('settle');
      return res.json();
    },
    onSuccess: async () => {
      toast.success(t('superAdmin.payments.settled'));
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments() });
    },
    onError: () => toast.error(t('auth.somethingWrong')),
  });

  if (isLoading) return <AdminLoadingState />;

  const purchases = (data?.marketplacePurchases ?? []) as MarketplacePurchaseRow[];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.payments')} description={t('superAdmin.payments.desc')} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="surface-3d border-white/25 bg-card/80 backdrop-blur-md dark:border-white/10">
          <CardHeader><CardTitle className="text-sm">{t('admin.estimatedMrr')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatLocaleCurrency(data?.estimatedMrr ?? 0, locale, { maximumFractionDigits: 2 })}</CardContent>
        </Card>
        <Card className="surface-3d border-white/25 bg-card/80 backdrop-blur-md dark:border-white/10">
          <CardHeader><CardTitle className="text-sm">{t('admin.paddleSubscribers')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{formatLocaleNumber(data?.paddleSubscribers ?? 0, locale)}</CardContent>
        </Card>
        <Card className="surface-3d border-white/25 bg-card/80 backdrop-blur-md dark:border-white/10">
          <CardHeader><CardTitle className="text-sm">{t('superAdmin.payments.unsettledNet')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatLocaleCurrency((data?.unsettledSellerNetCents ?? 0) / 100, locale, { maximumFractionDigits: 2 })}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-3d border-white/25 bg-card/80 backdrop-blur-md dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.payments.marketplaceSettlements')}</CardTitle>
          <p className="text-xs text-muted-foreground">{t('superAdmin.payments.marketplaceSettlementsDesc')}</p>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('superAdmin.payments.noMarketplacePurchases')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('superAdmin.payments.colListing')}</TableHead>
                  <TableHead>{t('superAdmin.payments.colSeller')}</TableHead>
                  <TableHead>{t('superAdmin.payments.colNet')}</TableHead>
                  <TableHead>{t('superAdmin.payments.colStatus')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.listing.title}</div>
                      <div className="text-xs text-muted-foreground">{formatLocaleDateTime(p.createdAt, locale)}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {p.listing.seller.displayName}
                      <div className="text-xs text-muted-foreground">{p.listing.seller.user.email}</div>
                    </TableCell>
                    <TableCell>
                      {formatLocaleCurrency(p.sellerNetCents / 100, locale, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {p.settledAt ? (
                        <Badge variant="secondary">{t('superAdmin.payments.statusSettled')}</Badge>
                      ) : (
                        <Badge variant="outline">{t('superAdmin.payments.statusUnsettled')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!p.settledAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          loading={settleMutation.isPending}
                          onClick={() => settleMutation.mutate(p.id)}
                        >
                          {t('superAdmin.payments.markSettled')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="surface-3d border-white/25 bg-card/80 backdrop-blur-md dark:border-white/10">
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
