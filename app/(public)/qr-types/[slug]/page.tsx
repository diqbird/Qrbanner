import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildQrTypePages, getQrTypeBySlug } from '@/lib/qr-type-pages';
import { localizeQrTypePage } from '@/lib/i18n/resolve-programmatic-copy';
import { USE_CASES_BY_QR_CATEGORY, getUseCaseBySlug } from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { pageMetadata } from '@/lib/seo';
import { ProgrammaticPageShell } from '@/components/seo/programmatic-page-shell';
import { ProgrammaticInternalLinks } from '@/components/seo/programmatic-internal-links';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export function generateStaticParams() {
  return buildQrTypePages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = await getServerLocale();
  const page = getQrTypeBySlug(params.slug);
  if (!page) return {};
  const localized = localizeQrTypePage(page, locale);
  return pageMetadata({
    locale,
    title: localized.title,
    description: localized.metaDescription,
    path: `/qr-types/${localized.slug}`,
    keywords: localized.keywords,
  });
}

export default async function QrTypeDetailPage({ params }: { params: { slug: string } }) {
  const raw = getQrTypeBySlug(params.slug);
  if (!raw) notFound();

  const locale = await getServerLocale();
  const page = localizeQrTypePage(raw, locale);
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const typeName = page.title.replace(' Generator', '');
  const createUrl = `/qr/create?category=${page.categoryId}`;
  const relatedUseCases = (USE_CASES_BY_QR_CATEGORY[page.categoryId] ?? [])
    .map((slug) => {
      const uc = getUseCaseBySlug(slug);
      return uc ? localizeUseCasePage(uc, locale) : null;
    })
    .filter(Boolean);

  return (
    <>
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
      {relatedUseCases.length > 0 && (
        <div className="border-t border-border/40 bg-muted/20 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-lg font-semibold text-center">{t('internalLinks.relatedUseCases')}</h2>
            <ul className="mt-4 flex flex-col items-center gap-2">
              {relatedUseCases.map((uc) =>
                uc ? (
                  <li key={uc.slug}>
                    <Link
                      href={`/use-cases/${uc.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      {uc.title} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      )}
      <div className="py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ProgrammaticInternalLinks variant="compact" />
        </div>
      </div>
    </>
  );
}
