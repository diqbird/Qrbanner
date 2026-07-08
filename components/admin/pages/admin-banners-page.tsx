'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type BannerSettings = {
  announcementEnabled: boolean;
  announcementText: string;
  announcementTextTr: string;
  announcementLink: string;
};

export function AdminBannersPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.banners(),
    queryFn: async () => {
      const res = await fetch('/api/admin/banners');
      if (!res.ok) throw new Error('banners');
      return res.json() as Promise<BannerSettings>;
    },
  });

  const [form, setForm] = useState<BannerSettings>({
    announcementEnabled: false,
    announcementText: '',
    announcementTextTr: '',
    announcementLink: '',
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (patch: BannerSettings) => {
      const res = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('save');
      return res.json() as Promise<BannerSettings>;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(adminQueryKeys.banners(), saved);
      toast.success(t('superAdmin.banners.saved'));
    },
    onError: () => toast.error(t('superAdmin.banners.saveFailed')),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('superAdmin.nav.banners')} description={t('superAdmin.banners.desc')} />
        <AdminLoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.banners')}
        description={t('superAdmin.banners.desc')}
        actions={
          <Badge variant={form.announcementEnabled ? 'default' : 'secondary'}>
            {form.announcementEnabled ? t('superAdmin.active') : t('superAdmin.inactive')}
          </Badge>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.banners.announcementTitle')}</CardTitle>
          <CardDescription>{t('superAdmin.banners.announcementDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium text-sm">{t('superAdmin.banners.enableLabel')}</p>
              <p className="text-xs text-muted-foreground">{t('superAdmin.banners.enableHint')}</p>
            </div>
            <Switch
              checked={form.announcementEnabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, announcementEnabled: v }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-en">{t('superAdmin.banners.textEn')}</Label>
            <Input
              id="banner-en"
              maxLength={200}
              value={form.announcementText}
              onChange={(e) => setForm((f) => ({ ...f, announcementText: e.target.value }))}
              placeholder="🎉 New: bulk QR import is live — try it free"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-tr">{t('superAdmin.banners.textTr')}</Label>
            <Input
              id="banner-tr"
              maxLength={200}
              value={form.announcementTextTr}
              onChange={(e) => setForm((f) => ({ ...f, announcementTextTr: e.target.value }))}
              placeholder="🎉 Yeni: toplu QR içe aktarma yayında — ücretsiz deneyin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-link">{t('superAdmin.banners.link')}</Label>
            <Input
              id="banner-link"
              maxLength={300}
              value={form.announcementLink}
              onChange={(e) => setForm((f) => ({ ...f, announcementLink: e.target.value }))}
              placeholder="/features"
            />
            <p className="text-xs text-muted-foreground">{t('superAdmin.banners.linkHint')}</p>
          </div>
          <Button onClick={() => mutation.mutate(form)} loading={mutation.isPending}>
            {t('superAdmin.banners.save')}
          </Button>
        </CardContent>
      </Card>
      {form.announcementEnabled && form.announcementText ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('superAdmin.banners.preview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground">
              {form.announcementText}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
