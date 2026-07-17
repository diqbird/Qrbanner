'use client';

import { Reveal } from '@/components/landing/premium/primitives';
import { getComparisonRows } from '@/lib/i18n/pricing-content';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingComparisonTable({ pricing }: { pricing: PricingPageState }) {
  const { t, locale } = pricing;
  const comparison = getComparisonRows(locale);

  return (
    <Reveal className="mt-20 sm:mt-24">
      <h2 className="ph-title text-center text-2xl sm:text-3xl">{t('pricing.whyTitle')}</h2>
      <p className="mt-2 text-center text-muted-foreground">{t('pricing.whySubtitle')}</p>
      <div className="ph-card mt-8 overflow-x-auto hover:translate-y-0 hover:scale-100">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left dark:bg-white/[0.03]">
              <th className="p-4 font-medium">{t('pricing.colFeature')}</th>
              <th className="p-4 font-medium">QRbanner</th>
              <th className="p-4 font-medium">{t('pricing.colTypical')}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature} className="border-b border-border/50 last:border-0">
                <td className="p-4">{row.feature}</td>
                <td className="p-4 font-medium text-[#2563EB] dark:text-sky-400">{row.qrbanner}</td>
                <td className="p-4 text-muted-foreground">{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
