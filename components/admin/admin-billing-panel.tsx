'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Users } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdminPlanCounts } from '@/lib/admin-billing-stats';

interface AdminBillingPanelProps {
  planCounts: AdminPlanCounts;
  estimatedMrr: number;
  paddleSubscribers: number;
}

export function AdminBillingPanel({
  planCounts,
  estimatedMrr,
  paddleSubscribers,
}: AdminBillingPanelProps) {
  const { t } = useLanguage();
  const manualPremium = Math.max(0, planCounts.pro + planCounts.business + planCounts.agency - paddleSubscribers);

  const tiers = (['pro', 'business', 'agency'] as const).map((id) => ({
    id,
    name: PLANS[id].name,
    count: planCounts[id],
    price: PLANS[id].priceLabel,
  }));

  return (
    <Card data-testid="admin-billing-panel">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {t('admin.billingTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('admin.billingSubtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              {t('admin.estimatedMrr')}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">${estimatedMrr.toFixed(2)}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{t('admin.estimatedMrrHint')}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              {t('admin.paddleSubscribers')}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">{paddleSubscribers}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {t('admin.manualPremium')}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">{manualPremium}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{t('admin.manualPremiumHint')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('admin.planBreakdown')}
          </p>
          <div className="flex flex-wrap gap-2">
            {tiers.map((tier) => (
              <Badge key={tier.id} variant="secondary" className="gap-1.5 font-normal">
                <span className="font-medium">{tier.name}</span>
                <span className="text-muted-foreground">· {tier.price}</span>
                <span className="font-mono">{tier.count}</span>
              </Badge>
            ))}
            <Badge variant="outline" className="gap-1.5 font-normal">
              <span className="font-medium">{t('admin.planFree')}</span>
              <span className="font-mono">{planCounts.free}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
