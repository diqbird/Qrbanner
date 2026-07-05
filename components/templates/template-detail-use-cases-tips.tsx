'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveTemplateUseCases, resolveTemplateTips } from '@/lib/i18n/resolve-template-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function TemplateDetailUseCasesTips({
  template,
}: {
  template: IndustryTemplate;
}) {
  const { t } = useLanguage();
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const tips = resolveTemplateTips(t, template.id, template.tips);

  return (
    <>
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
    </>
  );
}

export function TemplateDetailFooterCta({ createUrl }: { createUrl: string }) {
  const { t } = useLanguage();

  return (
    <div className="mt-12 text-center">
      <Link href={createUrl}>
        <Button size="lg" variant="outline" className="gap-2 rounded-full">
          {t('templateDetail.createCta')} <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
