import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUseCaseBySlug, USE_CASE_PAGES } from '@/lib/use-case-pages';
import { getSolutionBySlug } from '@/lib/solutions';
import { pageMetadata } from '@/lib/seo';
import { ProgrammaticPageShell } from '@/components/seo/programmatic-page-shell';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export function generateStaticParams() {
  return USE_CASE_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getUseCaseBySlug(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/use-cases/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function UseCaseDetailPage({ params }: { params: { slug: string } }) {
  const page = getUseCaseBySlug(params.slug);
  if (!page) notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const createUrl = `/qr/create?category=${page.categoryId}`;
  const relatedSolution = page.relatedSolutionSlug
    ? getSolutionBySlug(page.relatedSolutionSlug)
    : undefined;

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
    </>
  );
}
