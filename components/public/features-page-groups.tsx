'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { getFeatureGroups } from '@/lib/i18n/feature-groups';
import { freePlanQrLimit } from '@/lib/plans';

export function FeaturesPageGroups() {
  const { locale } = useLanguage();
  const groups = getFeatureGroups(locale);

  return (
    <div className="mt-20 space-y-20">
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`group-${group.title}`}>
          <div className="mb-8">
            <h2 id={`group-${group.title}`} className="font-display text-2xl font-bold">
              {group.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{group.description}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" aria-hidden />
                  </div>
                  {feature.tag && <Badge variant="secondary">{feature.tag}</Badge>}
                </div>
                <h3 className="font-display font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FeaturesPageBottomCta() {
  const { t } = useLanguage();

  return (
    <section className="mt-20 rounded-2xl border border-border/50 bg-card/60 p-8 text-center sm:p-12">
      <h2 className="font-display text-2xl font-bold">{t('features.bottomCtaTitle')}</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        {t('features.bottomCtaDesc', { count: freePlanQrLimit() })}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/solutions">
          <Button variant="outline">{t('nav.solutions')}</Button>
        </Link>
        <Link href="/developers">
          <Button variant="outline">{t('footer.apiWebhooks')}</Button>
        </Link>
        <Link href="/signup">
          <Button className="gap-2">
            {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
