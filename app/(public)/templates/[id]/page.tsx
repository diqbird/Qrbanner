import { notFound } from 'next/navigation';
import { INDUSTRY_TEMPLATES, getTemplateById } from '@/lib/industry-templates';
import { TemplateDetailShell } from '@/components/templates/template-detail-shell';
import { pageMetadata } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

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

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const template = getTemplateById(params.id);
  if (!template) notFound();
  return <TemplateDetailShell templateId={template.id} />;
}
