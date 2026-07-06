'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateUseCases,
} from '@/lib/i18n/resolve-template-copy';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';
import { createUrlForTemplate } from '@/lib/template-marketplace';
import type { IndustryTemplate } from '@/lib/industry-templates';

function TemplateSwatch({ template }: { template: IndustryTemplate }) {
  const fg = template.style.fgColor ?? '#000000';
  const bg = template.style.bgColor ?? '#ffffff';
  return (
    <div
      className="h-10 w-10 shrink-0 rounded-lg border shadow-inner"
      style={{ background: `linear-gradient(135deg, ${bg} 50%, ${fg} 50%)` }}
      aria-hidden
    />
  );
}

export function TemplateMarketplaceCard({ template }: { template: IndustryTemplate }) {
  const { t } = useLanguage();
  const name = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const href = createUrlForTemplate(template.id);

  return (
    <article
      className="group flex flex-col rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      data-testid={`marketplace-template-${template.id}`}
    >
      <div className="flex items-start gap-3">
        <TemplateSwatch template={template} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/templates/${template.id}`} className="font-display text-base font-semibold hover:text-primary">
              {name}
            </Link>
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
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {t('templateMarketplace.useTemplate')} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
