'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useBillingStatus } from '@/hooks/use-billing-status';
import { getLaunchBanner } from '@/lib/i18n/pricing-content';

interface UsageResponse {
  plan: { id: string; name: string; priceLabel: string };
  usage: {
    qrCodes: number;
    qrLimit: number;
    customDomains: number;
    domainLimit: number;
    bulkRowLimit: number;
    webhooks: number;
    webhookLimit: number;
    automations: number;
    automationLimit: number;
    styleTemplates: number;
    styleTemplateLimit: number;
  };
}

function UsageMeter({
  label,
  used,
  limit,
  warningLabel,
  fullLabel,
}: {
  label: string;
  used: number;
  limit: number;
  warningLabel: string;
  fullLabel: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct >= 100 ? 'bg-amber-500' : pct >= 80 ? 'bg-amber-400' : 'bg-primary';
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-muted-foreground">
          {used} / {limit}
          {pct >= 100 && <span className="ml-2 text-amber-600">{fullLabel}</span>}
          {pct >= 80 && pct < 100 && <span className="ml-2 text-amber-600">{warningLabel}</span>}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PlanUsageCard({ refreshKey = 0 }: { refreshKey?: number }) {
  const { t, locale } = useLanguage();
  const { configured: billingConfigured } = useBillingStatus();
  const [data, setData] = useState<UsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const body = await res.json();
      if (body?.url) {
        window.location.href = body.url;
        return;
      }
      const { toast } = await import('sonner');
      toast.error(body?.error ?? t('billing.portalError'));
    } catch {
      const { toast } = await import('sonner');
      toast.error(t('billing.portalError'));
    } finally {
      setPortalLoading(false);
    }
  };

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
            <p className="font-display text-lg font-bold">{data.plan.name}</p>
          </div>
          <Badge variant="secondary">{data.plan.priceLabel}{data.plan.priceLabel === '$0' ? '' : '/mo'}</Badge>
        </div>
        <UsageMeter label={t('planUsage.qrCodes')} used={data.usage.qrCodes} limit={data.usage.qrLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <UsageMeter label={t('planUsage.customDomains')} used={data.usage.customDomains} limit={data.usage.domainLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <UsageMeter label={t('planUsage.webhooks')} used={data.usage.webhooks} limit={data.usage.webhookLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <UsageMeter label={t('planUsage.automations')} used={data.usage.automations} limit={data.usage.automationLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <UsageMeter label={t('planUsage.styleTemplates')} used={data.usage.styleTemplates} limit={data.usage.styleTemplateLimit} warningLabel={t('planUsage.meterWarning')} fullLabel={t('planUsage.meterFull')} />
        <p className="text-xs text-muted-foreground">
          {t('planUsage.bulkHint', { limit: data.usage.bulkRowLimit })}
        </p>
        <Link href="/pricing">
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            {t('planUsage.viewPricing')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        {data.plan.id !== 'free' && (
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
