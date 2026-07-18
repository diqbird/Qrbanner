'use client';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveTemplateName } from '@/lib/i18n/resolve-template-copy';
import { getTemplateById } from '@/lib/industry-templates';
import { createUrlForTemplate } from '@/lib/template-marketplace';
import { TemplateDetailHeader } from './template-detail-header';
import { TemplateDetailUseCasesTips, TemplateDetailFooterCta } from './template-detail-use-cases-tips';

export function TemplateDetailShell({
  templateId,
  faqTitle,
  faqItems,
}: {
  templateId: string;
  faqTitle?: string;
  faqItems?: { question: string; answer: string }[];
}) {
  const { t } = useLanguage();
  const template = getTemplateById(templateId);
  if (!template) return null;

  const name = resolveTemplateName(t, template.id, template.name);
  const createUrl = createUrlForTemplate(template.id);

  return (
    <PremiumPageFrame narrow="3xl">
      <div data-testid="template-detail">
        <PublicBreadcrumbs
          items={[
            { label: t('nav.templates'), href: '/templates' },
            { label: name, href: `/templates/${template.id}` },
          ]}
        />
        <TemplateDetailHeader template={template} createUrl={createUrl} />
        <TemplateDetailUseCasesTips template={template} />
        {faqTitle && faqItems && faqItems.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">{faqTitle}</h2>
            <ul className="mt-4 space-y-4">
              {faqItems.map((item) => (
                <li
                  key={item.question}
                  className="rounded-xl border border-border/50 bg-card/60 px-4 py-4 text-sm"
                >
                  <p className="font-medium text-foreground">{item.question}</p>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <TemplateDetailFooterCta createUrl={createUrl} />
      </div>
    </PremiumPageFrame>
  );
}
