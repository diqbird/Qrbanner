'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { Reveal } from '@/components/landing/premium/primitives';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';
import { getFeatureGroups } from '@/lib/i18n/feature-groups';

export function FeaturesPageGroups() {
  const { locale } = useLanguage();
  const groups = getFeatureGroups(locale);

  return (
    <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
      {groups.map((group, groupIndex) => (
        <Reveal key={group.title} delay={0.03 * groupIndex}>
          <section aria-labelledby={`group-${group.title}`}>
            <div className="mb-8">
              <h2 id={`group-${group.title}`} className="ph-title text-2xl sm:text-3xl">
                {group.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {group.features.map((feature) => (
                <article key={feature.title} className="ph-card p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                      <feature.icon className="h-5 w-5" aria-hidden />
                    </span>
                    {feature.tag && (
                      <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {feature.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="ph-title text-base">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

export function FeaturesPageBottomCta() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();

  return (
    <Reveal className="mt-16 sm:mt-20">
      <section className="ph-dark-band overflow-hidden rounded-[1.5rem] p-8 text-center text-white sm:p-12">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {t('features.bottomCtaTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          {t('features.bottomCtaDesc', { qrLabel: formatFreePlanDynamicQrShortLabel(locale) })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localePath('/solutions')} className="ph-btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
            {t('nav.solutions')}
          </Link>
          <Link href={localePath('/developers')} className="ph-btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
            {t('footer.apiWebhooks')}
          </Link>
          <Link href="/signup" className="ph-btn-primary bg-white text-slate-900 shadow-none hover:bg-slate-100">
            {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
