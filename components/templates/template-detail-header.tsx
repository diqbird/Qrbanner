'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndustryTemplateGuide } from '@/components/qr/industry-template-guide';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveTemplateName, resolveTemplateTagline } from '@/lib/i18n/resolve-template-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';

export function TemplateDetailHeader({
  template,
  createUrl,
}: {
  template: IndustryTemplate;
  createUrl: string;
}) {
  const { t } = useLanguage();
  const name = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);

  return (
    <>
      <Link
        href="/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('templateDetail.backToMarketplace')}
      </Link>

      <header className="mt-6 text-center">
        <Badge variant="outline" className="mb-3">
          {resolveCategoryShortName(t, template.category)}
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
    </>
  );
}
