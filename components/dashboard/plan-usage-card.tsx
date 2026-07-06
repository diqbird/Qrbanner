'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolvePlanDisplayName } from '@/lib/i18n/resolve-plan-display-name';
import { useBillingStatus } from '@/hooks/use-billing-status';
import { usePlanUsage } from '@/hooks/use-plan-usage';
import { PlanUsageMeter } from './plan-usage-meter';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';

export function PlanUsageCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const { locale } = useLanguage();
  const { configured: billingConfigured } = useBillingStatus();
  const { data, loading, portalLoading, openBillingPortal, t } = usePlanUsage(refreshKey);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-full max-w-sm animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {t('planUsage.loadFailed')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <CreditCard className="h-5 w-5 text-primary" />
          {t('planUsage.title')}
        </CardTitle>
        <CardDescription>{getLaunchBanner(locale, { billingLive: billingConfigured })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('planUsage.currentPlan')}</p>
            <p className="font-display text-lg font-bold">{resolvePlanDisplayName(data.plan.id, locale)}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary">
              {data.plan.priceLabel === '$0' || data.plan.id === 'free'
                ? t('planUsage.priceFree')
                : t('planUsage.pricePerMonth', { price: data.plan.priceLabel })}
            </Badge>
            {data.trial?.active && (
              <Badge variant="outline" className="text-primary border-primary/30">
                {t('planUsage.trialDaysLeft', { days: data.trial.daysLeft })}
              </Badge>
            )}
          </div>
        </div>
        {data.trial?.active && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
            {t('planUsage.trialActiveDesc', { days: data.trial.daysLeft })}
            <Link href="/pricing" className="ml-1 text-primary hover:underline">
              {t('planUsage.trialUpgradeCta')}
            </Link>
          </div>
        )}
        <PlanUsageMeter label={t('planUsage.qrCodes')} used={data.usage.qrCodes} limit={data.usage.qrLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <PlanUsageMeter label={t('planUsage.customDomains')} used={data.usage.customDomains} limit={data.usage.domainLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <PlanUsageMeter label={t('planUsage.webhooks')} used={data.usage.webhooks} limit={data.usage.webhookLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <PlanUsageMeter label={t('planUsage.automations')} used={data.usage.automations} limit={data.usage.automationLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <PlanUsageMeter label={t('planUsage.styleTemplates')} used={data.usage.styleTemplates} limit={data.usage.styleTemplateLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <p className="text-xs text-muted-foreground">
          {t('planUsage.bulkHint', { limit: data.usage.bulkRowLimit })}
        </p>
        <Link href="/pricing">
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            {t('planUsage.viewPricing')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        {data.plan.id !== 'free' && !data.trial?.active && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 w-full sm:w-auto"
            loading={portalLoading}
            onClick={openBillingPortal}
          >
            <ExternalLink className="h-4 w-4" /> {t('billing.manage')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
