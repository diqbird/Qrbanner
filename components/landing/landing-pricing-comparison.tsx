'use client';

import Link from 'next/link';
import { getComparisonRows } from '@/lib/i18n/pricing-content';
import { localizePath } from '@/lib/i18n';
import type { LandingPricingState } from '@/hooks/use-landing-pricing';

export function LandingPricingComparison({ pricing }: { pricing: LandingPricingState }) {
  const { t, locale } = pricing;
  const comparison = getComparisonRows(locale).slice(0, 8);

  return (
    <div className="mt-16">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <h3 className="font-display text-lg font-semibold">{t('pricing.whyTitle')}</h3>
        <Link href={localizePath('/pricing', locale)} className="text-sm font-medium text-primary hover:underline">
          {t('landing.pricingCompare')}
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="p-3 font-medium">{t('pricing.colFeature')}</th>
              <th className="p-3 font-medium">QRbanner</th>
              <th className="p-3 font-medium">{t('pricing.colTypical')}</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature} className="border-b last:border-0">
                <td className="p-3">{row.feature}</td>
                <td className="p-3 font-medium text-primary">{row.qrbanner}</td>
                <td className="p-3 text-muted-foreground">{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
