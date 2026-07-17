'use client';

import { ShieldCheck, CreditCard, RefreshCw, Lock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { Reveal } from '@/components/landing/premium/primitives';
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
    <Reveal className="mt-10">
      <div className="ph-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 hover:translate-y-0 hover:scale-100">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
              <item.icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
