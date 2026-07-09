'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type StudioRow = {
  id: string;
  buyerEmail: string;
  maxQr: number;
  qrRemaining: number;
  status: string;
  url: string;
  externalOrderId: string | null;
  createdAt: string;
};

export function AdminStudioPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [buyerEmail, setBuyerEmail] = useState('');
  const [maxQr, setMaxQr] = useState('5');
  const [orderId, setOrderId] = useState('');
  const [expiresDays, setExpiresDays] = useState('365');
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'studio'],
    queryFn: async () => {
      const res = await fetch('/api/admin/studio');
      if (!res.ok) throw new Error('fetch_failed');
      return (await res.json()) as { items: StudioRow[] };
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail,
          maxQr: Number(maxQr),
          externalOrderId: orderId || undefined,
          expiresInDays: Number(expiresDays),
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error('create_failed');
      return res.json() as Promise<{ url: string }>;
    },
    onSuccess: async (json) => {
      await navigator.clipboard.writeText(json.url);
      toast.success(t('superAdmin.studio.created'));
      setBuyerEmail('');
      setOrderId('');
      setNotes('');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'studio'] });
    },
    onError: () => toast.error(t('superAdmin.studio.createFailed')),
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/studio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'revoked' }),
      });
      if (!res.ok) throw new Error('revoke_failed');
    },
    onSuccess: () => {
      toast.success(t('superAdmin.studio.revoked'));
      void queryClient.invalidateQueries({ queryKey: ['admin', 'studio'] });
    },
  });

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success(t('superAdmin.studio.copied'));
  };

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.studio')} description={t('superAdmin.studio.desc')} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.studio.createTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="studio-buyer-email">{t('superAdmin.studio.buyerEmail')}</Label>
            <Input
              id="studio-buyer-email"
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-max-qr">{t('superAdmin.studio.maxQr')}</Label>
            <Input id="studio-max-qr" type="number" min={1} max={20} value={maxQr} onChange={(e) => setMaxQr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-expires">{t('superAdmin.studio.expiresDays')}</Label>
            <Input id="studio-expires" type="number" min={1} max={730} value={expiresDays} onChange={(e) => setExpiresDays(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-order">{t('superAdmin.studio.orderId')}</Label>
            <Input id="studio-order" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studio-notes">{t('superAdmin.studio.notes')}</Label>
            <Input id="studio-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Button
              disabled={!buyerEmail.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {t('superAdmin.studio.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? <AdminLoadingState /> : null}
      {!isLoading && items.length === 0 ? <AdminEmptyState title={t('superAdmin.studio.empty')} /> : null}

      {!isLoading && items.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('superAdmin.studio.colEmail')}</TableHead>
                  <TableHead>{t('superAdmin.studio.colPack')}</TableHead>
                  <TableHead>{t('superAdmin.studio.colStatus')}</TableHead>
                  <TableHead>{t('superAdmin.studio.colUrl')}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row: StudioRow) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.buyerEmail}</TableCell>
                    <TableCell>
                      {row.maxQr - row.qrRemaining}/{row.maxQr}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => void copyUrl(row.url)}>
                        <Copy className="h-3.5 w-3.5" />
                        {t('superAdmin.studio.copyUrl')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {row.status !== 'revoked' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={revokeMutation.isPending}
                          onClick={() => revokeMutation.mutate(row.id)}
                        >
                          {t('superAdmin.studio.revoke')}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
