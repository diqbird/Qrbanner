'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { PlanId } from '@/lib/plans';
import { planCtaLabel } from '@/lib/i18n/pricing-content';
import { earlyAccessContactHref, isPaidCheckoutClosed } from '@/lib/pricing-display';

type Props = {
  planId: PlanId;
  priceMonthly: number | null;
  highlighted?: boolean;
  billingConfigured: boolean;
  billingLoading: boolean;
  loadingPlan: PlanId | null;
  className?: string;
  t: (key: string) => string;
  onCheckout: () => void;
};

export function PricingPlanCardButton({
  planId,
  priceMonthly,
  highlighted = false,
  billingConfigured,
  billingLoading,
  loadingPlan,
  className = 'mt-8 w-full',
  t,
  onCheckout,
}: Props) {
  const paidClosed = isPaidCheckoutClosed(priceMonthly, billingConfigured, billingLoading);

  if (paidClosed) {
    return (
      <Button asChild className={className} variant={highlighted ? 'default' : 'outline'}>
        <Link href={earlyAccessContactHref(planId)}>{t('pricing.billingSoonCta')}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={className}
      variant={highlighted ? 'default' : 'outline'}
      onClick={onCheckout}
      disabled={loadingPlan === planId}
    >
      {loadingPlan === planId ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        planCtaLabel(planId, priceMonthly, t)
      )}
    </Button>
  );
}
