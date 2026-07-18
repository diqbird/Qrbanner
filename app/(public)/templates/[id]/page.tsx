import { notFound } from 'next/navigation';
import { INDUSTRY_TEMPLATES, getTemplateById } from '@/lib/industry-templates';
import { TemplateDetailShell } from '@/components/templates/template-detail-shell';
import { pageMetadata, webPageJsonLd, faqJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { resolveTemplateTips } from '@/lib/i18n/resolve-template-copy';

export const revalidate = 3600;

export function generateStaticParams() {
  return INDUSTRY_TEMPLATES.map((tpl) => ({ id: tpl.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id);
  if (!template) return {};

  const locale = await getServerLocale();
  const nameKey = `templates.names.${template.id}`;
  const taglineKey = `templates.meta.${template.id}.tagline`;
  const nameRaw = translate(locale, nameKey);
  const name = nameRaw === nameKey ? template.name : nameRaw;
  const taglineRaw = translate(locale, taglineKey);
  const tagline = taglineRaw === taglineKey ? template.tagline : taglineRaw;

  return pageMetadata({
    locale,
    title: translate(locale, 'templateDetail.metaTitle', { name }),
    description: tagline,
    path: `/templates/${template.id}`,
    keywords: [
      `${name} QR template`,
      'professional QR code template',
      template.category,
      ...template.useCases.slice(0, 4).map((u) => `${u} QR`),
    ],
  });
}

export default async function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id);
  if (!template) notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const nameKey = `templates.names.${template.id}`;
  const taglineKey = `templates.meta.${template.id}.tagline`;
  const nameRaw = t(nameKey);
  const name = nameRaw === nameKey ? template.name : nameRaw;
  const taglineRaw = t(taglineKey);
  const tagline = taglineRaw === taglineKey ? template.tagline : taglineRaw;
  const tips = resolveTemplateTips(t, template.id, template.tips);

  const faqItems = [
    {
      question: t('templateDetail.faqWhatQ', { name }),
      answer: tagline,
    },
    {
      question: t('templateDetail.faqHowQ', { name }),
      answer: tips.length
        ? tips.map((tip, i) => `${i + 1}. ${tip}`).join(' ')
        : tagline,
    },
    {
      question: t('templateDetail.faqWhyQ', { name }),
      answer: t('templateDetail.faqWhyA'),
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            title: name,
            description: tagline,
            path: `/templates/${template.id}`,
            locale,
          }),
          faqJsonLd(faqItems),
        ]}
      />
      <TemplateDetailShell
        templateId={template.id}
        faqTitle={t('templateDetail.faqTitle')}
        faqItems={faqItems}
      />
    </>
  );
}
