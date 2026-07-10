'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateUseCases,
} from '@/lib/i18n/resolve-template-copy';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';
import { createUrlForTemplate } from '@/lib/template-marketplace';
import { TemplateQrPreview } from '@/components/templates/template-qr-preview';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function TemplateMarketplaceCard({ template }: { template: IndustryTemplate }) {
  const { t } = useLanguage();
  const name = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const createHref = createUrlForTemplate(template.id);
  const detailHref = `/templates/${template.id}`;

  return (
    <article
      className="group flex flex-col rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      data-testid={`marketplace-template-${template.id}`}
    >
      <div className="flex items-start gap-3">
        <TemplateQrPreview template={template} size={64} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold">{name}</h3>
            <Badge variant="outline" className="text-[10px]">
              {resolveCategoryShortName(t, template.category)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{tagline}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {useCases.slice(0, 3).map((u) => (
          <Badge key={u} variant="secondary" className="text-[10px] font-normal">
            {u}
          </Badge>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm" className="gap-1.5" asChild>
          <Link href={createHref}>
            {t('templateMarketplace.useTemplate')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Link href={detailHref} className="text-sm text-muted-foreground hover:text-foreground">
          {t('templateMarketplace.viewDetails')}
        </Link>
      </div>
    </article>
  );
}
