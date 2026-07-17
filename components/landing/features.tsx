'use client';

import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { getFeatureGroups } from '@/lib/i18n/feature-groups';

export function LandingFeatures() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const preview = getFeatureGroups(locale).flatMap((g) => g.features).slice(0, 9);

  return (
    <section className="bg-muted/30 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('landing.featuresTitle')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('landing.featuresSubtitle')}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((feature, i) => (
            <div
              key={feature.title}
              className={`group surface-3d rounded-2xl bg-card/80 p-6 backdrop-blur-sm transition-transform hover:-translate-y-1 ${
                inView ? 'animate-fade-up' : ''
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg icon-well-primary-hover">
                  <feature.icon className="h-5 w-5" />
                </div>
                {feature.tag && (
                  <Badge variant="secondary" className="text-[10px]">{feature.tag}</Badge>
                )}
              </div>
              <h3 className="font-display text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={localePath('/features')}>
            <Button variant="outline" className="gap-2">
              {t('landing.featuresViewAll')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
