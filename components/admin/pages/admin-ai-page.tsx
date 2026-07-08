'use client';

import { useQuery } from '@tanstack/react-query';
import { Bot, Sparkles, Palette, Megaphone } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type AiStatus = {
  llmConfigured: boolean;
  model: string;
  usage: { landingPagesEnabled: number; aiCampaignBatches: number; styleTemplates: number };
};

export function AdminAiPage() {
  const { t, locale } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.ai(),
    queryFn: async () => {
      const res = await fetch('/api/admin/ai');
      if (!res.ok) throw new Error('ai');
      return res.json() as Promise<AiStatus>;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title={t('superAdmin.nav.ai')} description={t('superAdmin.ai.desc')} />
        <AdminLoadingState />
      </div>
    );
  }

  const features = [
    { icon: Sparkles, title: t('superAdmin.ai.landingCopy'), desc: t('superAdmin.ai.landingCopyDesc'), metric: data.usage.landingPagesEnabled, metricLabel: t('superAdmin.ai.landingPagesEnabled') },
    { icon: Megaphone, title: t('superAdmin.ai.campaignPlanner'), desc: t('superAdmin.ai.campaignPlannerDesc'), metric: data.usage.aiCampaignBatches, metricLabel: t('superAdmin.ai.campaignBatches') },
    { icon: Palette, title: t('superAdmin.ai.styleSuggestions'), desc: t('superAdmin.ai.styleSuggestionsDesc'), metric: data.usage.styleTemplates, metricLabel: t('superAdmin.ai.styleTemplates') },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('superAdmin.nav.ai')}
        description={t('superAdmin.ai.desc')}
        actions={
          <Badge variant={data.llmConfigured ? 'default' : 'destructive'}>
            {data.llmConfigured ? t('superAdmin.ai.llmOn') : t('superAdmin.ai.llmOff')}
          </Badge>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-primary" /> {t('superAdmin.ai.providerTitle')}
          </CardTitle>
          <CardDescription>
            {data.llmConfigured
              ? t('superAdmin.ai.providerConfigured', { model: data.model })
              : t('superAdmin.ai.providerMissing')}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <f.icon className="h-5 w-5 text-primary" /> {f.title}
              </CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-bold">{formatLocaleNumber(f.metric, locale)}</p>
              <p className="text-xs text-muted-foreground">{f.metricLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
