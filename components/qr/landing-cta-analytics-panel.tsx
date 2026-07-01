'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointerClick, Percent, Eye } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export interface LandingCtaAnalytics {
  totalClicks: number;
  landingViews: number;
  conversionRate: number | null;
  clicksByType: { name: string; type: string; value: number }[];
  clicksByDay: { date: string; count: number }[];
}

export function LandingCtaAnalyticsPanel({ data }: { data: LandingCtaAnalytics }) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <MousePointerClick className="h-4 w-4 text-primary" />
          {t('analytics.landingCtaTitle')}
        </CardTitle>
        <CardDescription>{t('analytics.landingCtaDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              {t('analytics.landingViews')}
            </div>
            <p className="mt-1 font-display text-2xl font-bold">{data.landingViews}</p>
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="h-4 w-4" />
              {t('analytics.ctaClicks')}
            </div>
            <p className="mt-1 font-display text-2xl font-bold">{data.totalClicks}</p>
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" />
              {t('analytics.ctaConversion')}
            </div>
            <p className="mt-1 font-display text-2xl font-bold">
              {data.conversionRate != null ? `${data.conversionRate}%` : '—'}
            </p>
          </div>
        </div>

        {data.clicksByType.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('analytics.ctaByType')}</p>
            <div className="flex flex-wrap gap-2">
              {data.clicksByType.map((row) => (
                <div
                  key={row.type}
                  className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm"
                >
                  {row.name}: <span className="font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.totalClicks === 0 && (
          <p className="text-sm text-muted-foreground">{t('analytics.landingCtaEmpty')}</p>
        )}
      </CardContent>
    </Card>
  );
}
