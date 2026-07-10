'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatFreePlanDynamicQrLabel } from '@/lib/i18n/dynamic-qr-label';
import { Button } from '@/components/ui/button';

export function BillingComingSoonBanner() {
  const { t, locale } = useLanguage();

  return (
    <div
      className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-left sm:p-5"
      role="status"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <div>
            <p className="font-medium text-sm">{t('pricing.billingSoonTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('pricing.billingSoonDesc', { qrLabel: formatFreePlanDynamicQrLabel(locale) })}
            </p>
          </div>
        </div>
        <Link href="/contact" className="shrink-0">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            {t('pricing.billingSoonCta')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
