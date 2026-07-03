import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUseCaseBySlug, USE_CASE_PAGES } from '@/lib/use-case-pages';
import { getQrTypeBySlug } from '@/lib/qr-type-pages';
import { localizeQrTypePage, localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { getSolutionBySlug } from '@/lib/solutions';
import { pageMetadata } from '@/lib/seo';
import { ProgrammaticPageShell } from '@/components/seo/programmatic-page-shell';
import { ProgrammaticInternalLinks } from '@/components/seo/programmatic-internal-links';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export function generateStaticParams() {
  return USE_CASE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = await getServerLocale();
  const page = getUseCaseBySlug(params.slug);
  if (!page) return {};
  const localized = localizeUseCasePage(page, locale);
  return pageMetadata({
    locale,
    title: localized.title,
    description: localized.metaDescription,
    path: `/use-cases/${localized.slug}`,
    keywords: localized.keywords,
  });
}

export default async function UseCaseDetailPage({ params }: { params: { slug: string } }) {
  const raw = getUseCaseBySlug(params.slug);
  if (!raw) notFound();

  const locale = await getServerLocale();
  const page = localizeUseCasePage(raw, locale);
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const createUrl = `/qr/create?category=${page.categoryId}`;
  const relatedSolution = page.relatedSolutionSlug
    ? getSolutionBySlug(page.relatedSolutionSlug)
    : undefined;
  const relatedQrType = getQrTypeBySlug(page.categoryId);
  const localizedQrType = relatedQrType ? localizeQrTypePage(relatedQrType, locale) : null;

  return (
    <>
      <ProgrammaticPageShell
        breadcrumbs={[
          { label: t('nav.useCases'), href: '/use-cases' },
          { label: page.title, href: `/use-cases/${page.slug}` },
        ]}
        headline={page.headline}
        description={page.description}
        primaryHref={createUrl}
        primaryLabel={t('useCaseDetail.createLabel')}
        sections={[
          { title: t('useCaseDetail.benefitsTitle'), items: page.benefits },
          { title: t('useCaseDetail.stepsTitle'), items: page.steps, ordered: true },
        ]}
        ctaTitle={t('useCaseDetail.ctaTitle')}
        ctaBody={t('useCaseDetail.ctaBody')}
      />
      {relatedSolution && (
        <div className="border-t border-border/40 bg-muted/20 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <p className="text-sm text-muted-foreground">{t('useCaseDetail.relatedSolution')}</p>
            <Link href={`/solutions/${relatedSolution.slug}`} className="mt-3 inline-block">
              <Button variant="outline" className="gap-2">
                {relatedSolution.title} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      {localizedQrType && (
        <div className="border-t border-border/40 py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <p className="text-sm text-muted-foreground">{t('internalLinks.relatedQrType')}</p>
            <Link href={`/qr-types/${localizedQrType.slug}`} className="mt-3 inline-block">
              <Button variant="outline" className="gap-2">
                {localizedQrType.title.replace(' Generator', '')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className="pb-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ProgrammaticInternalLinks variant="compact" />
        </div>
      </div>
    </>
  );
}
