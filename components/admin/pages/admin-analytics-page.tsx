'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/components/i18n/language-provider';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminAnalyticsPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('analytics');
      return res.json();
    },
  });

  if (isLoading) return <AdminLoadingState />;

  const chartData = (data?.scansByDay ?? []).map((d: { day: string; count: number }) => ({
    day: new Date(d.day).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' }),
    scans: d.count,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.analytics')} description={t('superAdmin.analytics.desc')} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('superAdmin.analytics.scans7d'), value: data?.scansLast7Days },
          { label: t('superAdmin.analytics.scans30d'), value: data?.scansLast30Days },
          { label: t('superAdmin.analytics.leads30d'), value: data?.leadsLast30Days },
          { label: t('superAdmin.analytics.cta30d'), value: data?.ctaClicksLast30Days },
        ].map((s) => (
          <Card key={s.label}><CardHeader className="pb-2"><CardTitle className="text-sm">{s.label}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatLocaleNumber(s.value ?? 0, locale)}</CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{t('superAdmin.analytics.chart')}</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}><XAxis dataKey="day" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
