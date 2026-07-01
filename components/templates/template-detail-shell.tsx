'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { IndustryTemplateGuide } from '@/components/qr/industry-template-guide';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateUseCases,
  resolveTemplateTips,
} from '@/lib/i18n/resolve-template-copy';
import { getTemplateById } from '@/lib/industry-templates';
import { categoryShortName } from '@/lib/qr-utils';
import { createUrlForTemplate } from '@/lib/template-marketplace';

export function TemplateDetailShell({ templateId }: { templateId: string }) {
  const { t } = useLanguage();
  const template = getTemplateById(templateId);
  if (!template) return null;

  const name = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const tips = resolveTemplateTips(t, template.id, template.tips);
  const createUrl = createUrlForTemplate(template.id);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.templates'), href: '/templates' },
          { label: name, href: `/templates/${template.id}` },
        ]}
      />
      <div className="py-10 sm:py-16" data-testid="template-detail">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('templateDetail.backToMarketplace')}
          </Link>

          <header className="mt-6 text-center">
            <Badge variant="outline" className="mb-3">
              {categoryShortName(template.category)}
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{tagline}</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">{template.description}</p>
            <Link href={createUrl} className="mt-8 inline-block" data-testid="template-detail-create-cta">
              <Button size="lg" className="gap-2 rounded-full px-8">
                {t('templateDetail.createCta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </header>

          <div className="mt-10">
            <IndustryTemplateGuide template={template} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">{t('templateDetail.useCasesTitle')}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {useCases.map((u) => (
                <li
                  key={u}
                  className="rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-sm text-muted-foreground"
                >
                  {u}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">{t('templateDetail.tipsTitle')}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 text-center">
            <Link href={createUrl}>
              <Button size="lg" variant="outline" className="gap-2 rounded-full">
                {t('templateDetail.createCta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
