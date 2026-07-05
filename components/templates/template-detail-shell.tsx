'use client';

import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveTemplateName } from '@/lib/i18n/resolve-template-copy';
import { getTemplateById } from '@/lib/industry-templates';
import { createUrlForTemplate } from '@/lib/template-marketplace';
import { TemplateDetailHeader } from './template-detail-header';
import { TemplateDetailUseCasesTips, TemplateDetailFooterCta } from './template-detail-use-cases-tips';

export function TemplateDetailShell({ templateId }: { templateId: string }) {
  const { t } = useLanguage();
  const template = getTemplateById(templateId);
  if (!template) return null;

  const name = resolveTemplateName(t, template.id, template.name);
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
          <TemplateDetailHeader template={template} createUrl={createUrl} />
          <TemplateDetailUseCasesTips template={template} />
          <TemplateDetailFooterCta createUrl={createUrl} />
        </div>
      </div>
    </>
  );
}
