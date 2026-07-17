'use client';

import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { Reveal } from '@/components/landing/premium/primitives';
import { formatAgencyQrCodeCount } from '@/lib/i18n/qr-type-count';

export function EnterpriseCtaBand() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();
  const codes = formatAgencyQrCodeCount(locale);

  return (
    <Reveal className="mt-16">
      <section className="ph-dark-band overflow-hidden rounded-[1.5rem] p-8 text-white sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Building2 className="h-6 w-6 text-cyan-300" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                {t('pricing.enterpriseBandTitle', { codes })}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-300">{t('pricing.enterpriseBandDesc')}</p>
            </div>
          </div>
          <Link href={localePath('/enterprise')} className="ph-btn-primary shrink-0 bg-white text-slate-900 shadow-none hover:bg-slate-100">
            {t('pricing.enterpriseBandCta')} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
