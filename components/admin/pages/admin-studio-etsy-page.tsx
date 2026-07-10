'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, Send, Mail } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader, AdminEmptyState, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type EtsyRow = {
  id: string;
  buyerEmail: string;
  maxQr: number;
  status: string;
  deliveryStatus: string;
  externalOrderId: string | null;
  url: string;
  createdAt: string;
  sentAt: string | null;
};

export function AdminStudioEtsyPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [buyerEmail, setBuyerEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState<'awaiting_approval' | 'sent'>('awaiting_approval');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'studio', 'etsy', tab],
    queryFn: async () => {
      const res = await fetch(`/api/admin/studio/etsy?status=${tab}`);
      if (!res.ok) throw new Error('fetch_failed');
      return (await res.json()) as { items: EtsyRow[] };
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/studio/etsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail,
          externalOrderId: orderId || undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error('register_failed');
      return res.json();
    },
    onSuccess: () => {
      toast.success(t('superAdmin.studioEtsy.registered'));
      setBuyerEmail('');
      setOrderId('');
      setNotes('');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'studio', 'etsy'] });
    },
    onError: () => toast.error(t('superAdmin.studioEtsy.registerFailed')),
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/studio/etsy/${id}/approve`, { method: 'POST' });
      const json = (await res.json()) as { error?: string; emailSent?: boolean; url?: string };
      if (!res.ok) {
        if (json.error === 'email_failed' && json.url) {
          await navigator.clipboard.writeText(json.url);
          throw new Error('email_failed');
        }
        throw new Error(json.error ?? 'approve_failed');
      }
      return json;
    },
    onSuccess: (json) => {
      if (json.emailSent) {
        toast.success(t('superAdmin.studioEtsy.approved'));
      } else {
        toast.message(t('superAdmin.studioEtsy.emailFailed'));
      }
      void queryClient.invalidateQueries({ queryKey: ['admin', 'studio', 'etsy'] });
    },
    onError: (err: Error) => {
      if (err.message === 'email_failed') {
        toast.error(t('superAdmin.studioEtsy.emailFailed'));
        return;
      }
      toast.error(t('superAdmin.studioEtsy.approveFailed'));
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/studio/etsy/${id}/resend`, { method: 'POST' });
      const json = (await res.json()) as { error?: string; emailSent?: boolean; url?: string };
      if (!res.ok) {
        if (json.error === 'email_failed' && json.url) {
          await navigator.clipboard.writeText(json.url);
          throw new Error('email_failed');
        }
        throw new Error(json.error ?? 'resend_failed');
      }
      return json;
    },
    onSuccess: (json) => {
      if (json.emailSent) {
        toast.success(t('superAdmin.studioEtsy.resent'));
      } else {
        toast.message(t('superAdmin.studioEtsy.emailFailed'));
      }
    },
    onError: (err: Error) => {
      if (err.message === 'email_failed') {
        toast.error(t('superAdmin.studioEtsy.emailFailed'));
        return;
      }
      toast.error(t('superAdmin.studioEtsy.resendFailed'));
    },
  });

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success(t('superAdmin.studioEtsy.copied'));
  };

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.studioEtsy')}
        description={t('superAdmin.studioEtsy.desc')}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.studioEtsy.registerTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="etsy-buyer-email">{t('superAdmin.studioEtsy.buyerEmail')}</Label>
            <Input
              id="etsy-buyer-email"
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etsy-order-id">{t('superAdmin.studioEtsy.orderId')}</Label>
            <Input id="etsy-order-id" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etsy-notes">{t('superAdmin.studioEtsy.notes')}</Label>
            <Input id="etsy-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <Badge variant="secondary">5 QR</Badge>
            <Button
              disabled={!buyerEmail.trim() || registerMutation.isPending}
              onClick={() => registerMutation.mutate()}
            >
              {t('superAdmin.studioEtsy.register')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="awaiting_approval">{t('superAdmin.studioEtsy.tabPending')}</TabsTrigger>
          <TabsTrigger value="sent">{t('superAdmin.studioEtsy.tabSent')}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {isLoading ? <AdminLoadingState /> : null}
          {!isLoading && items.length === 0 ? (
            <AdminEmptyState
              title={
                tab === 'awaiting_approval'
                  ? t('superAdmin.studioEtsy.emptyPending')
                  : t('superAdmin.studioEtsy.emptySent')
              }
            />
          ) : null}
          {!isLoading && items.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('superAdmin.studio.colEmail')}</TableHead>
                      <TableHead>{t('superAdmin.studioEtsy.colOrder')}</TableHead>
                      <TableHead>{t('superAdmin.studioEtsy.colDelivery')}</TableHead>
                      <TableHead>{t('superAdmin.studioEtsy.colCreated')}</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row: EtsyRow) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">{row.buyerEmail}</TableCell>
                        <TableCell className="text-xs">{row.externalOrderId ?? '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {row.deliveryStatus === 'awaiting_approval'
                              ? t('superAdmin.studioEtsy.deliveryAwaiting')
                              : t('superAdmin.studioEtsy.deliverySent')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(row.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => void copyUrl(row.url)}>
                            <Copy className="h-3.5 w-3.5" />
                            {t('superAdmin.studioEtsy.copyUrl')}
                          </Button>
                          {row.deliveryStatus === 'awaiting_approval' ? (
                            <Button
                              size="sm"
                              className="gap-1"
                              disabled={approveMutation.isPending}
                              onClick={() => approveMutation.mutate(row.id)}
                            >
                              <Send className="h-3.5 w-3.5" />
                              {t('superAdmin.studioEtsy.approveSend')}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              disabled={resendMutation.isPending}
                              onClick={() => resendMutation.mutate(row.id)}
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {t('superAdmin.studioEtsy.resendEmail')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
