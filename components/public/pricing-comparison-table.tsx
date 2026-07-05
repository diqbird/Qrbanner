'use client';

import { getComparisonRows } from '@/lib/i18n/pricing-content';
import type { PricingPageState } from '@/hooks/use-pricing-page';

export function PricingComparisonTable({ pricing }: { pricing: PricingPageState }) {
  const { t, locale } = pricing;
  const comparison = getComparisonRows(locale);

  return (
    <div className="mt-24">
      <h2 className="font-display text-2xl font-bold text-center">{t('pricing.whyTitle')}</h2>
      <p className="mt-2 text-center text-muted-foreground">{t('pricing.whySubtitle')}</p>
      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="p-4 font-medium">{t('pricing.colFeature')}</th>
              <th className="p-4 font-medium">QRbanner</th>
              <th className="p-4 font-medium">{t('pricing.colTypical')}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature} className="border-b last:border-0">
                <td className="p-4">{row.feature}</td>
                <td className="p-4 font-medium text-primary">{row.qrbanner}</td>
                <td className="p-4 text-muted-foreground">{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
