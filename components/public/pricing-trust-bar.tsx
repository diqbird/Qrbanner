'use client';

import { ShieldCheck, CreditCard, RefreshCw, Lock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { refundWindowDayVars } from '@/lib/i18n/policy-day-vars';

/** Reassurance strip below the pricing grid — reduces checkout hesitation. */
export function PricingTrustBar() {
  const { t, locale } = useLanguage();
  const refundVars = refundWindowDayVars(locale);

  const items = [
    { icon: ShieldCheck, label: t('pricing.trust.guarantee', refundVars) },
    { icon: CreditCard, label: t('pricing.trust.noCard') },
    { icon: RefreshCw, label: t('pricing.trust.cancelAnytime') },
    { icon: Lock, label: t('pricing.trust.securePayment') },
  ];

  return (
    <div className="mt-10 grid gap-3 rounded-2xl border border-border/50 bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5 text-sm">
          <item.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
