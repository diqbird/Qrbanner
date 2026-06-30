'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { useLanguage } from '@/components/i18n/language-provider';

export function ProgrammaticPageShell({
  breadcrumbs,
  headline,
  description,
  primaryHref,
  primaryLabel,
  sections,
  ctaTitle,
  ctaBody,
}: {
  breadcrumbs: { label: string; href: string }[];
  headline: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  sections: { title: string; items: string[]; ordered?: boolean }[];
  ctaTitle: string;
  ctaBody: string;
}) {
  const { t } = useLanguage();

  return (
    <>
      <PublicBreadcrumbs items={breadcrumbs} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{headline}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={primaryHref}>
                <Button size="lg" className="gap-2">
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  {t('qrTypeDetail.viewPricing')}
                </Button>
              </Link>
            </div>
          </header>

          {sections.map((section) => (
            <section key={section.title} className="mt-14">
              <h2 className="font-display text-xl font-semibold">{section.title}</h2>
              {section.ordered ? (
                <ol className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="font-display text-xl font-semibold">{ctaTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{ctaBody}</p>
            <Link href={primaryHref} className="mt-4 inline-block">
              <Button className="gap-2">
                {t('qrTypeDetail.getStartedFree')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
