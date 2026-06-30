import { notFound } from 'next/navigation';
import { buildQrTypePages, getQrTypeBySlug } from '@/lib/qr-type-pages';
import { pageMetadata } from '@/lib/seo';
import { ProgrammaticPageShell } from '@/components/seo/programmatic-page-shell';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export function generateStaticParams() {
  return buildQrTypePages().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getQrTypeBySlug(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/qr-types/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function QrTypeDetailPage({ params }: { params: { slug: string } }) {
  const page = getQrTypeBySlug(params.slug);
  if (!page) notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const typeName = page.title.replace(' Generator', '');
  const createUrl = `/qr/create?category=${page.categoryId}`;

  return (
    <ProgrammaticPageShell
      breadcrumbs={[
        { label: t('nav.qrTypes'), href: '/qr-types' },
        { label: typeName, href: `/qr-types/${page.slug}` },
      ]}
      headline={page.headline}
      description={page.description}
      primaryHref={createUrl}
      primaryLabel={t('qrTypeDetail.createLabel', { type: typeName })}
      sections={[
        { title: t('qrTypeDetail.whyUse'), items: page.benefits },
        { title: t('qrTypeDetail.popularUseCases'), items: page.useCases },
      ]}
      ctaTitle={t('qrTypeDetail.ctaTitle')}
      ctaBody={page.isDynamic ? t('qrTypeDetail.ctaDynamic') : t('qrTypeDetail.ctaStatic')}
    />
  );
}
